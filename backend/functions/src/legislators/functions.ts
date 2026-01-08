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
