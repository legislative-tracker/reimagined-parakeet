import * as logger from "firebase-functions/logger";
import { db } from "../config.js";
import { getOpenStatesData } from "../apis/open-states/functions.js";
import { Person } from "@jpstroud/opencivicdata-types";
import { Legislator } from "../models/legislature.js";
import { isEmail, isImageLink, getMemberUpdates } from "../common/helpers.js";

/**
 * Represents the structure of the update result for a specific state legislature.
 */
export interface UpdateResult {
  state: string;
  matched?: number;
  warnings?: string[];
  error?: string;
}

/**
 * Partial data structure used for updating a Legislator document in Firestore.
 */
export interface LegislatorUpdate {
  updated_at: string;
  party?: string;
  image?: string;
  email?: string;
  offices?: Legislator["offices"];
  links?: Legislator["links"];
  openstates_url?: string;
  other_identifiers?: Legislator["other_identifiers"];
}

/**
 * Type guard to safely check if an unknown error is an instance of Error.
 * @param error - The unknown error to check.
 */
function isNativeError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Orchestrates the synchronization process between OpenStates/State APIs and Firestore.
 * @returns A promise resolving to an array of UpdateResults.
 * @description Uses strict unknown error handling and type guards to ensure application stability.
 */
export const updateLegislators = async (): Promise<UpdateResult[]> => {
  const bulkWriter = db.bulkWriter();
  const results: UpdateResult[] = [];

  try {
    const legislaturesSnapshot = await db.collection("legislatures").get();

    const updatePromises = legislaturesSnapshot.docs.map(async (doc) => {
      const stateCode = doc.id;
      const stateData = doc.data();
      const stateName = stateData?.name;

      if (!stateName) {
        logger.warn(`Skipping ${stateCode}: Missing 'name' property.`);
        return;
      }

      try {
        const openStatesPromise = getOpenStatesData(stateName, "people");

        const stateApiPromise = getMemberUpdates(stateCode).catch(
          (err: unknown) => {
            const message = isNativeError(err)
              ? err.message
              : "Unknown API Error";
            logger.info(
              `No specific API for ${stateCode}: ${message}. Using OpenStates only.`
            );
            return [] as Legislator[];
          }
        );

        const [openStatesMembers, stateMembers] = await Promise.all([
          openStatesPromise,
          stateApiPromise,
        ]);

        const stateMemberMap = new Map<string, Legislator>();
        stateMembers.forEach((m) => {
          const key = `${m.chamber.toUpperCase()}-${m.district}`;
          stateMemberMap.set(key, m);
        });

        const snapshot = await db
          .collection(`legislatures/${stateCode}/legislators`)
          .get();

        const warnings: string[] = [];

        snapshot.docs.forEach((doc) => {
          const currentData = doc.data();
          const docChamber =
            currentData.chamber?.toUpperCase() === "SENATE"
              ? "SENATE"
              : "ASSEMBLY";
          const lookupKey = `${docChamber}-${currentData.district}`;

          const osMatch = openStatesMembers.find(
            (m: Person) =>
              m.current_role.title === currentData.honorific_prefix &&
              m.current_role.district === currentData.district
          );

          const stateMatch = stateMemberMap.get(lookupKey);

          if (osMatch || stateMatch) {
            const updates: LegislatorUpdate = {
              updated_at: new Date().toISOString(),
              party: stateMatch?.party || osMatch?.party,
              links: osMatch?.links || stateMatch?.links || [],
              openstates_url: osMatch?.openstates_url || "",
              other_identifiers: [
                ...(osMatch?.other_identifiers || []),
                ...(stateMatch?.other_identifiers || []),
              ],
            };

            const newImage = stateMatch?.image || osMatch?.image;
            if (isImageLink(newImage)) updates.image = newImage;

            const newEmail = stateMatch?.email || osMatch?.email;
            if (isEmail(newEmail)) updates.email = newEmail;

            if (stateMatch?.offices && stateMatch.offices.length > 0) {
              updates.offices = stateMatch.offices;
            } else if (osMatch?.offices) {
              updates.offices = osMatch.offices;
            }

            bulkWriter.set(doc.ref, updates, { merge: true });
          } else {
            warnings.push(`No match for ${currentData.name} (${lookupKey})`);
          }
        });

        results.push({
          state: stateCode,
          matched: snapshot.size - warnings.length,
          warnings: warnings,
        });
      } catch (err: unknown) {
        const errorMessage = isNativeError(err)
          ? err.message
          : "An unexpected error occurred";
        logger.error(`Failed to update ${stateName}`, { error: errorMessage });
        results.push({
          state: stateCode,
          error: errorMessage,
        });
      }
    });

    await Promise.all(updatePromises);
    await bulkWriter.close();

    return results;
  } catch (error: unknown) {
    const finalErrorMessage = isNativeError(error)
      ? error.message
      : "Global sync failure";
    logger.error("Global Update Failed", { error: finalErrorMessage });
    throw error;
  }
};
