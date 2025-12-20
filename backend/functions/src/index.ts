/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
// import * as logger from "firebase-functions/logger";
import { updateBills, updateMembers } from "./ny/functions";
import { testList } from "./test-list";

initializeApp();
const db = getFirestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

setGlobalOptions({ maxInstances: 10 });

export const helloWorld = onRequest(async (request, response) => {
  const members = await updateMembers();
  const bills = await updateBills(testList);

  bills.forEach(
    async (bill) =>
      await db
        .collection("legislatures/ny/legislation")
        .doc(bill.id)
        .set(bill, { merge: true })
  );

  members.forEach(
    async (member) =>
      await db
        .collection("legislatures/ny/legislators")
        .doc(member.id)
        .set(member, { merge: true })
  );

  response.send("Update Complete!");
});
