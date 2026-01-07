import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";

import { db } from "./config";
import { getBillUpdates, isEmail, isImageLink } from "./common/helpers";
import { getOpenStatesData } from "./apis/open-states/functions";
import { OSPerson } from "./apis/open-states/types";
import { Legislation, Legislator } from "./models/legislature";

/**
 * Scheduled Functions
 */
export const nightlyUpdate = onSchedule(
  {
    schedule: "0 5 * * *",
    timeZone: "America/New_York",
    retryCount: 3, // Optional: Retry if it crashes
  },
  async () => {
    logger.info("🌙 Starting nightly legislation update...");

    performLegislationUpdate();
    performSponsorshipUpdate();

    logger.info(" Nightly update finished.");
  }
);

/**
 * On Request functions
 */
export const updateLegislationOnRequest = onRequest(
  async (request, response) => {
    try {
      // Call the shared logic
      const data = await performLegislationUpdate();

      // Send the result to the user (great for debugging!)
      response.send({
        status: "success",
        timestamp: new Date().toISOString(),
        data: data,
      });
    } catch (error: unknown) {
      logger.error("HTTP Update Failed", error);
      response.status(500).send({ error: error });
    }
  }
);

export const updateLegislatorsOnRequest = onRequest(
  async (request, response) => {
    const bulkWriter = db.bulkWriter();
    const stateName = "New York"; // TODO: refactor when adding new states
    const stateCode = "ny";
    try {
      const openStatesMembers = await getOpenStatesData(stateName, "people");

      const snapshot = await db
        .collection(`legislatures/${stateCode}/legislators`)
        .get();

      const warnings: string[] = [];

      snapshot.docs.forEach((doc) => {
        // current legislator data
        const currentData = doc.data();

        // find the corresponding Open States Member
        const member = openStatesMembers.find(
          (m: OSPerson) =>
            m.current_role.title === currentData.honorific_prefix &&
            m.current_role.district === currentData.district
        );

        if (member) {
          const updates = {
            party: member.party,
            image: isImageLink(currentData.image)
              ? currentData.image
              : member.image,
            gender: member.gender,
            birth_date: member.birth_date,
            email: isEmail(currentData.email)
              ? currentData.email
              : isEmail(member.email)
                ? member.email
                : null,
            updated_at: new Date().toISOString(),
          };

          bulkWriter.set(doc.ref, updates, { merge: true });
        } else {
          const warningStr = `Couldn't find updates for ${currentData.name}`;
          warnings.push(warningStr);
          logger.warn(warningStr);
        }
      });

      // write the updates to firestore
      await bulkWriter.close();

      response.send({
        status: "success",
        timestamp: new Date().toISOString(),
        warnings: warnings,
      });
    } catch (error: unknown) {
      logger.error("HTTP Update Failed", error);
      response.status(500).send({ error: error });
    }
  }
);

/**
 * Business logic
 */
const performLegislationUpdate = async () => {
  const legislaturesSnapshot = await db.collection("legislatures").get();
  const legislaturesList = legislaturesSnapshot.docs.map((doc) => doc.id);

  const pendingLookups = legislaturesList.map(async (legislature) => {
    const snapshot = await db
      .collection(`legislatures/${legislature}/legislation`)
      .get();

    const billList = snapshot.docs.map((doc) => doc.id);

    return { id: legislature, bills: billList };
  });

  const billListByLegislature = await Promise.all(pendingLookups);

  const updates = await Promise.all(
    billListByLegislature.map((o) => getBillUpdates(o))
  );

  await Promise.all(
    updates.map(async (u) => {
      const cRef = db.collection(`legislatures/${u.id}/legislation`);
      const billUpdates = u.bills.map(async (bill) =>
        cRef.doc(bill.id).set(bill, { merge: true })
      );

      await Promise.all(billUpdates);
    })
  );
};

const performSponsorshipUpdate = async () => {
  const legislaturesSnapshot = await db.collection("legislatures").get();
  const legislaturesList = legislaturesSnapshot.docs.map((doc) => doc.id);

  const bulkWriter = db.bulkWriter();

  await Promise.all(
    legislaturesList.map(async (legislature) => {
      const billsSnapshot = await db
        .collection(`legislatures/${legislature}/legislation`)
        .get();

      for (const doc of billsSnapshot.docs) {
        const billData = doc.data();
        const bill: Legislation = {
          id: doc.id,
          title: billData.title,
          version: billData.version,
          cosponsors: billData.cosponsors,
        };

        if (!bill.cosponsors) continue;

        const billVer =
          bill.version === "" ? "Original" : (bill.version as string);

        if (!bill.cosponsors[billVer]) continue;

        const currentVersionSponsorIds: string[] = bill.cosponsors[billVer].map(
          (o) => o.id
        );

        await Promise.all(
          currentVersionSponsorIds.map(async (sponsorId) => {
            const memberPath = `legislatures/${legislature}/legislators/${sponsorId}`;
            const memberRef = db.doc(memberPath);
            const memberSnapshot = await memberRef.get();

            if (!memberSnapshot.exists) {
              console.warn(`unknown Legislator at: ${memberPath}`);
              return;
            }

            const memberData = memberSnapshot.data() as Legislator;

            const sponsorshipEntry = {
              id: bill.id,
              version: billVer,
              title: bill.title as string,
            };

            if (!memberData.sponsorships) {
              memberData.sponsorships = [sponsorshipEntry];
            }

            const index = memberData.sponsorships.findIndex(
              (item) => item.id === bill.id
            );

            if (index === -1) {
              memberData.sponsorships.push(sponsorshipEntry);
            } else {
              memberData.sponsorships[index].version = billVer;
            }

            bulkWriter.set(memberRef, memberData, { merge: true });
          })
        );
      }
    })
  );

  await bulkWriter.close();

  return { updated: true };
};

/**
 * Test function
 */
export const helloWorld = onRequest(async (request, response) => {
  try {
    const data = await performSponsorshipUpdate();

    response.send({
      success: true,
      message: "Update Complete!",
      time: new Date().toISOString(),
      data: data,
    });
  } catch (error) {
    response.send({ success: false, message: "Update Failure!", error: error });
  }
});
