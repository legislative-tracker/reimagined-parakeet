import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { openStatesKey } from "../config";
import { nySenateKey } from "../apis/ny/functions";
import { updateLegislators } from "./service";

export const manualUpdate = onRequest(
  { secrets: [openStatesKey, nySenateKey] },
  async (request, response) => {
    try {
      const results = await updateLegislators();

      response.send({
        status: "success",
        timestamp: new Date().toISOString(),
        results: results,
      });
    } catch (error: unknown) {
      logger.error("HTTP Update Failed", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      response.status(500).send({ error: msg });
    }
  }
);

export const monthlyUpdate = onSchedule(
  {
    schedule: "1st Monday of month 05:00",
    timeZone: "America/New_York",
    secrets: [openStatesKey, nySenateKey],
    retryCount: 3,
  },
  async () => {
    logger.info("🗓️ Starting monthly legislator update...");

    try {
      const results = await updateLegislators();

      logger.info("✅ Monthly update complete.", results);
    } catch (error) {
      logger.error("❌ Monthly update failed.", error);
    }
  }
);
