import { onRequest } from "firebase-functions/v2/https";
import { db } from "./config";
import { getBillList } from "./helpers";
import { updateBills, updateMembers } from "./ny/functions"; // Assuming these are in a folder

// test function
export const helloWorld = onRequest(async (request, response) => {
  const billList = await getBillList("ny");
  const members = await updateMembers();
  const bills = await updateBills(billList);

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
