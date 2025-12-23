import { setGlobalOptions } from "firebase-functions";
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { updateBills, updateMembers } from "./ny/functions";
import { testList } from "./test-list";

initializeApp();
const db = getFirestore();
const auth = getAuth(); // Initialize Auth

setGlobalOptions({ maxInstances: 10 });

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
