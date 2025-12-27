import { onCall, HttpsError } from "firebase-functions/v2/https";
import got from "got";
import { auth, db, openStatesKey, googleMapsKey } from "./config";
import { getGeocode } from "./apis/google-geocoder/functions";
import { OSPerson } from "./apis/open-states/types";
import { isSuccess, mapPersonToLegislator } from "./common/helpers";

/**
 * Promotes a user to Admin status.
 */
export const addAdminRole = onCall(async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can promote other users."
    );
  }
  const targetEmail = request.data.email;
  if (!targetEmail) throw new HttpsError("invalid-argument", "Email required.");

  try {
    const user = await auth.getUserByEmail(targetEmail);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    return {
      message: `Success! ${targetEmail} has been granted admin privileges.`,
    };
  } catch (error: any) {
    if (error.code === "auth/user-not-found")
      throw new HttpsError("not-found", "User not found.");
    throw new HttpsError("internal", "Error setting admin claim.");
  }
});

/**
 * Removes Admin status from a user.
 */
export const removeAdminRole = onCall(async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError("permission-denied", "Only admins can demote users.");
  }
  const targetEmail = request.data.email;
  if (!targetEmail) throw new HttpsError("invalid-argument", "Email required.");
  if (request.auth.token.email === targetEmail) {
    throw new HttpsError("failed-precondition", "You cannot demote yourself.");
  }

  try {
    const user = await auth.getUserByEmail(targetEmail);
    await auth.setCustomUserClaims(user.uid, { admin: null });
    return { message: `Success! ${targetEmail} is no longer an admin.` };
  } catch (error: any) {
    if (error.code === "auth/user-not-found")
      throw new HttpsError("not-found", "User not found.");
    throw new HttpsError("internal", "Error removing admin claim.");
  }
});

/**
 * Adds or Updates a Bill.
 */
export const addBill = onCall(async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can add legislation."
    );
  }
  const { state, bill } = request.data;
  if (!state || !bill || !bill.id)
    throw new HttpsError("invalid-argument", "Invalid data.");

  try {
    const billRef = db
      .collection(`legislatures/${state}/legislation`)
      .doc(bill.id);
    await billRef.set(bill, { merge: true });
    return { message: `Success! Bill ${bill.id} added.`, path: billRef.path };
  } catch (error) {
    throw new HttpsError("internal", "Failed to save bill.");
  }
});

/**
 * Deletes a Bill.
 */
export const removeBill = onCall(async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can delete legislation."
    );
  }
  const { state, billId } = request.data;
  if (!state || !billId)
    throw new HttpsError("invalid-argument", "Invalid data.");

  try {
    const billRef = db
      .collection(`legislatures/${state}/legislation`)
      .doc(billId);
    await billRef.delete();
    return { message: `Success! Bill ${billId} removed.`, id: billId };
  } catch (error) {
    throw new HttpsError("internal", "Failed to delete bill.");
  }
});

const updateUserProfile = async (userId: string, data: any) => {
  const userRef = db.collection("users").doc(userId);
  await userRef.set(data, { merge: true });
};

/**
 * Fetches user's legislators & districts.
 */
export const fetchUserReps = onCall(
  { secrets: [openStatesKey, googleMapsKey] },
  async (request) => {
    const address = request.data.address;
    if (!address) throw new HttpsError("invalid-argument", "Address required.");

    const userId = request.auth?.uid;
    if (!userId) throw new HttpsError("invalid-argument", "User ID required.");

    // 1. Helpers are now imported from helpers.ts
    const geocoding = await getGeocode(address, googleMapsKey.value());
    if (!geocoding) throw new HttpsError("not-found", "Geocoding failed");

    const instance = got.extend({
      prefixUrl: "https://v3.openstates.org/",
      responseType: "json",
      resolveBodyOnly: true,
      searchParams: {
        apikey: openStatesKey.value(),
        lat: geocoding.lat,
        lng: geocoding.lng,
      },
    });

    try {
      const res = await instance("people.geo");

      if (isSuccess<OSPerson[]>(res)) {
        // Logic remains the same, shortened for brevity
        const legislators = {
          federal: res.results
            .filter((p) => p.jurisdiction.classification === "country")
            .map(mapPersonToLegislator),
          state: res.results
            .filter((p) => p.jurisdiction.classification === "state")
            .map(mapPersonToLegislator),
        };

        const districts = {
          federal: legislators.federal.find((p) => p.chamber === "House")
            ?.district,
          state: {
            assembly: legislators.state.find((p) => p.chamber === "Assembly")
              ?.district,
            senate: legislators.state.find((p) => p.chamber === "Senate")
              ?.district,
          },
        };

        await updateUserProfile(userId, { legislators, districts });
        return { legislators, districts };
      } else {
        throw new HttpsError("unavailable", "Failed to parse data.");
      }
    } catch (error) {
      throw new HttpsError("unknown", "Failed to fetch reps.");
    }
  }
);
