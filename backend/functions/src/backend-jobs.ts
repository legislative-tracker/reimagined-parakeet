import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";

import { db } from "./config";
import { getBillUpdates } from "./common/helpers";

/**
 * Scheduled Functions
 */
export const nightlyUpdate = onSchedule(
  {
    schedule: "0 5 * * *",
    timeZone: "America/New_York",
    retryCount: 3, // Optional: Retry if it crashes
  },
  async (event) => {
    logger.info("🌙 Starting nightly legislation update...");

    performLegislationUpdate();

    logger.info("✅ Nightly update finished.");
  }
);

/**
 * On Request functions
 */
export const updateLegislationOnRequest = onRequest(
  async (request, response) => {
    try {
      // 1. Call the shared logic
      const data = await performLegislationUpdate();

      // 2. Send the result to the user (great for debugging!)
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

  updates.forEach(async (u) => {
    const cRef = db.collection(`legislatures/${u.id}/legislation`);
    const billUpdates = u.bills.map(async (bill) =>
      cRef.doc(bill.id).set(bill, { merge: true })
    );

    await Promise.all(billUpdates);
  });
};

/**
 * Test function
 */
export const helloWorld = onRequest(async (request, response) => {
  response.send("Update Complete!");
});
