import { HttpsError } from "firebase-functions/v2/https";
import got from "got";
import { db } from "./config";
import { isSuccess } from "./common/helpers";
import { GoogleGeocodingResponse } from "./models/geocode";

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = db.collection("users").doc(userId);
  await userRef.set(data, { merge: true });
};

export const getGeocode = async (address: string, googleMapsKey: string) => {
  const options = {
    prefixUrl: "https://maps.googleapis.com/maps/api/geocode",
    responseType: "json" as const,
    resolveBodyOnly: true,
    searchParams: {
      key: googleMapsKey,
      address: address,
    },
  };

  const instance = got.extend(options);
  const res = await instance("json");

  if (isSuccess<GoogleGeocodingResponse[]>(res)) {
    return res.results[0].geometry.location;
  }

  throw new HttpsError("not-found", "Error finding geocoding", res);
};

export const getBillList = async (state: string) => {
  const snapshot = await db
    .collection(`legislatures/${state}/legislation`)
    .get();
  return snapshot.docs.map((doc) => {
    return { id: doc.id };
  });
};
