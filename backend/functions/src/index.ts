import { setGlobalOptions } from "firebase-functions";
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { defineSecret } from "firebase-functions/params";
import got, { Options } from "got";
import { updateBills, updateMembers } from "./ny/functions";
import { testList } from "./test-list";
import { Person } from "popolo-types";
import { Legislator } from "@models/legislator";
import { GoogleGeocodeingResponse } from "@models/geocode";

initializeApp();
const db = getFirestore();
const auth = getAuth();

setGlobalOptions({ maxInstances: 10 });

// test function
export const helloWorld = onRequest(async (request, response) => {
  const members = await updateMembers();
  const bills = await updateBills(testList);

  const billPromises = bills.map((bill) =>
    db
      .collection("legislatures/ny/legislation")
      .doc(bill.id)
      .set(bill, { merge: true })
  );

  const memberPromises = members.map((member) =>
    db
      .collection("legislatures/ny/legislators")
      .doc(member.id)
      .set(member, { merge: true })
  );

  await Promise.all([...billPromises, ...memberPromises]);

  response.send("Update Complete!");
});

/**
 * CALLABLE FUNCTION: Promotes a user to Admin status.
 */
export const addAdminRole = onCall(async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can promote other users."
    );
  }

  const targetEmail = request.data.email;

  if (!targetEmail) {
    throw new HttpsError(
      "invalid-argument",
      "You must provide an email address."
    );
  }

  try {
    // 2. Look up the user by email
    const user = await auth.getUserByEmail(targetEmail);

    // 3. Set Custom Claim: { admin: true }
    await auth.setCustomUserClaims(user.uid, { admin: true });

    return {
      message: `Success! ${targetEmail} has been granted admin privileges.`,
    };
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new HttpsError(
        "not-found",
        "No user found with that email address."
      );
    }
    throw new HttpsError("internal", "Error setting admin claim.");
  }
});

/**
 * CALLABLE FUNCTION: Removes Admin status from a user.
 */
export const removeAdminRole = onCall(async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError("permission-denied", "Only admins can demote users.");
  }

  const targetEmail = request.data.email;

  if (!targetEmail) {
    throw new HttpsError(
      "invalid-argument",
      "You must provide an email address."
    );
  }

  // This prevents an admin from accidentally locking themselves out
  if (request.auth.token.email === targetEmail) {
    throw new HttpsError(
      "failed-precondition",
      "You cannot demote yourself. Ask another admin to do it."
    );
  }

  try {
    const user = await auth.getUserByEmail(targetEmail);

    // Setting it to null effectively deletes the claim
    await auth.setCustomUserClaims(user.uid, { admin: null });

    return {
      message: `Success! ${targetEmail} is no longer an admin.`,
    };
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new HttpsError(
        "not-found",
        "No user found with that email address."
      );
    }
    throw new HttpsError("internal", "Error removing admin claim.");
  }
});

/**
 * CALLABLE FUNCTION: Adds or Updates a Bill in a specific state.
 */
export const addBill = onCall(async (request) => {
  // Security Check: Only admins can add bills manually
  if (request.auth?.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can add new legislation."
    );
  }

  const { state, bill } = request.data;

  // Input Validation
  if (!state || !bill || !bill.id) {
    throw new HttpsError(
      "invalid-argument",
      "Request must include 'state', 'bill' object, and 'bill.id'."
    );
  }

  try {
    // Path: legislatures/{state}/legislation/{billId}
    const billRef = db
      .collection(`legislatures/${state}/legislation`)
      .doc(bill.id);

    // We use set({ merge: true }) so if the bill exists, it updates it;
    // if not, it creates it.
    await billRef.set(bill, { merge: true });

    return {
      message: `Success! Bill ${bill.id} added to ${state}.`,
      path: billRef.path,
    };
  } catch (error) {
    console.error("Error adding bill:", error);
    throw new HttpsError("internal", "Failed to save bill to database.");
  }
});

/**
 * CALLABLE FUNCTION: Deletes a Bill from a specific state.
 */
export const removeBill = onCall(async (request) => {
  // Security Check: Only admins can delete bills
  if (request.auth?.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can delete legislation."
    );
  }

  const { state, billId } = request.data;

  // Input Validation
  if (!state || !billId) {
    throw new HttpsError(
      "invalid-argument",
      "Request must include 'state' and 'billId'."
    );
  }

  try {
    // Delete from Firestore
    // Path: legislatures/{state}/legislation/{billId}
    const billRef = db
      .collection(`legislatures/${state}/legislation`)
      .doc(billId);

    // Check if it exists first (optional, but good for reporting)
    const doc = await billRef.get();
    if (!doc.exists) {
      throw new HttpsError("not-found", "Bill not found.");
    }

    await billRef.delete();

    return {
      message: `Success! Bill ${billId} removed from ${state}.`,
      id: billId,
    };
  } catch (error: any) {
    // Re-throw specific HTTP errors we created above
    if (error instanceof HttpsError) throw error;

    console.error("Error deleting bill:", error);
    throw new HttpsError("internal", "Failed to delete bill from database.");
  }
});

/**
 * CALLABLE FUNCTION: fetches user's legislators & districts on formSubmit
 */
interface OpenStatesResponse<T> {
  results: T[];
}

interface OpenStatesPerson extends Person {
  id: string;
  name: string;
  party: string;
  current_role: {
    title: string;
    org_classification: string;
    district: string;
    division_id: string;
  };
  jurisdiction: {
    id: string;
    name: string;
    classification: string;
  };
  given_name: string;
  family_name: string;
  image: string;
  email: string;
  birth_date: string;
  death_date: string;
  extras: {
    [key: string]: string;
  };
  created_at: string;
  updated_at: string;
  openstates_url: string;
}

const isOpenStatesResponseSuccess = <T>(
  v: unknown
): v is OpenStatesResponse<T> => {
  if ((v as OpenStatesResponse<T>).results) return true;
  return false;
};

const openStatesKey = defineSecret("OPENSTATES_KEY");
const googleMapsKey = defineSecret("GOOGLE_MAPS_KEY");

export const fetchUserReps = onCall(
  { secrets: [openStatesKey, googleMapsKey] },
  async (request) => {
    console.log("Incoming Data:", request.data);

    const address = request.data.address;

    if (!address) {
      throw new HttpsError(
        "invalid-argument",
        `Address is required. Received: ${JSON.stringify(request.data)}`
      );
    }

    const geocoding = await getGeocode(address, googleMapsKey.value());

    if (!geocoding) {
      throw new HttpsError("not-found", "geocoding not found");
    }

    const options = new Options({
      prefixUrl: "https://v3.openstates.org/",
      responseType: "json",
      resolveBodyOnly: true,
      searchParams: {
        apikey: openStatesKey.value(),
        lat: geocoding.lat,
        lng: geocoding.lng,
      },
    });

    let userId = request.auth?.uid || "IWrLUtKusOMG6UxvEMxuu5s0lz03";

    if (!userId) {
      throw new HttpsError("invalid-argument", "You must provide a user id.");
    }

    const instance = got.extend(options);

    try {
      const res = await instance("people.geo");

      if (isOpenStatesResponseSuccess<OpenStatesPerson>(res)) {
        const legislators = {
          federal: res.results
            .filter(
              (p: OpenStatesPerson) =>
                p.jurisdiction.classification === "country"
            )
            .map((person: OpenStatesPerson) =>
              mapOpenStatesPersonToLegislator(person)
            ),
          state: res.results
            .filter(
              (p: OpenStatesPerson) => p.jurisdiction.classification === "state"
            )
            .map((person: OpenStatesPerson) =>
              mapOpenStatesPersonToLegislator(person)
            ),
        };

        const districts = {
          federal: legislators.federal.filter((p) => p.chamber === "House")[0]
            .district,
          state: {
            assembly: legislators.state.filter(
              (p) => p.chamber === "Assembly"
            )[0].district,
            senate: legislators.state.filter((p) => p.chamber === "Senate")[0]
              .district,
          },
        };

        await updateUserProfile(userId, {
          legislators: legislators,
          districts: districts,
        });

        return { legislators, districts };
      } else {
        console.error("OpenStates returned invalid format:", res);
        throw new HttpsError("unavailable", "Failed to parse legislator data.");
      }
    } catch (error: any) {
      console.error("error fetching user representatives", error);
      throw new HttpsError("unknown", "Failed to fetch user representatives");
    }
  }
);

const updateUserProfile = async (userId: string, data: any) => {
  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);

  await userRef.set(data, { merge: true });
};

const mapOpenStatesPersonToLegislator = (
  person: OpenStatesPerson
): Legislator => {
  const chamber: string = chamberMapper(
    person.jurisdiction.classification,
    person.current_role.org_classification
  );

  return {
    id: person.name.replaceAll(" ", "-"),
    honorific_prefix: person.current_role.title,
    name: person.name,
    party: person.party,
    chamber: chamber,
    district: person.current_role.district,
  };
};

interface ChamberMapping {
  [key: string]: {
    [key: string]: string;
  };
}

const chamberMapping: ChamberMapping = {
  country: {
    upper: "Senate",
    lower: "House",
  },
  state: {
    upper: "Senate",
    lower: "Assembly",
  },
};

const chamberMapper = (jurisdiction: string, org: string): string => {
  return chamberMapping[jurisdiction][org];
};

const isGoogleGeocodingResponseSuccess = (
  v: unknown
): v is GoogleGeocodeingResponse => {
  if ((v as GoogleGeocodeingResponse).results) return true;
  return false;
};

const getGeocode = async (address: string, googleMapsKey: string) => {
  const options = {
    prefixUrl: "https://maps.googleapis.com/maps/api/geocode", // Changed new Options to plain object (see tip below)
    responseType: "json" as const, // 'as const' fixes strict typing for got
    resolveBodyOnly: true,
    searchParams: {
      key: googleMapsKey,
      address: address, // 'got' automatically encodes this, double encoding breaks things!
    },
  };

  const instance = got.extend(options);

  // No try/catch needed here
  const res = await instance("json");

  if (isGoogleGeocodingResponseSuccess(res)) {
    return res.results[0].geometry.location;
  }

  throw new HttpsError("not-found", "Error finding geocoding", res);
};
