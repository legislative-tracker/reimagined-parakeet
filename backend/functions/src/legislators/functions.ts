import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db, openStatesKey } from "../config";
import { getOpenStatesData } from "../apis/open-states/functions";
import { Person } from "@jpstroud/opencivicdata-types";
import { isEmail, isImageLink } from "../common/helpers";

export const manualUpdate = onRequest(
  { secrets: [openStatesKey] },
  async (request, response) => {
    const bulkWriter = db.bulkWriter();
    const stateName = "New York";
    const stateCode = "ny";

    try {
      const openStatesMembers = await getOpenStatesData(stateName, "people");
      const snapshot = await db
        .collection(`legislatures/${stateCode}/legislators`)
        .get();
      const warnings: string[] = [];

      snapshot.docs.forEach((doc) => {
        const currentData = doc.data();
        const member = openStatesMembers.find(
          (m: Person) =>
            m.current_role.title === currentData.honorific_prefix &&
            m.current_role.district === currentData.district
        );

        if (member) {
          const updates = {
            party: member.party,
            current_role: member.current_role,
            jurisdiction: member.jurisdiction,
            image: isImageLink(currentData.image)
              ? currentData.image
              : member.image,
            email: isEmail(currentData.email)
              ? currentData.email
              : isEmail(member.email)
                ? member.email
                : null,
            gender: member.gender,
            birth_date: member.birth_date,
            updated_at: new Date().toISOString(),
            openstates_url: member.openstates_url,
            other_identifiers: member.other_identifiers,
            other_names: member.other_names,
            links: member.links,
            sources: member.sources,
            offices: member.offices,
          };
          bulkWriter.set(doc.ref, updates, { merge: true });
        } else {
          const warningStr = `Couldn't find updates for ${currentData.name}`;
          warnings.push(warningStr);
          logger.warn(warningStr);
        }
      });

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
