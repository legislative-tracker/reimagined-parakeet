import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { db } from "../config";
import { performLegislationUpdate } from "./service";

/**
 * Adds or Updates a Bill (Callable)
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
 * Deletes a Bill (Callable)
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

/**
 * Scheduled Nightly Update
 */
export const nightlyUpdate = onSchedule(
  {
    schedule: "0 5 * * *",
    timeZone: "America/New_York",
    retryCount: 3,
  },
  async () => {
    logger.info("🌙 Starting nightly legislation update...");
    await performLegislationUpdate();
    logger.info("✅ Nightly update finished.");
  }
);

/**
 * Manual Trigger for Debugging (HTTPS)
 */
export const manualUpdate = onRequest(async (request, response) => {
  try {
    const data = await performLegislationUpdate();
    response.send({
      status: "success",
      timestamp: new Date().toISOString(),
      data: data,
    });
  } catch (error: unknown) {
    logger.error("HTTP Update Failed", error);
    response.status(500).send({ error: error });
  }
});
