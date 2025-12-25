import { HttpsError } from "firebase-functions/v2/https";
import got from "got";
import { db } from "../config";
import { GoogleGeocodingResponse } from "../models/geocode";

import { OpenStatesPerson } from "@models/openstates-person";
import { Legislator } from "@models/legislator";

interface Success<T> {
  results: T;
}

export const isSuccess = <T>(res: unknown): res is Success<T> => {
  if ((res as Success<T>).results) return true;
  return false;
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

export const chamberMapper = (jurisdiction: string, org: string): string => {
  return chamberMapping[jurisdiction][org];
};

export const mapPersonToLegislator = (person: OpenStatesPerson): Legislator => {
  const chamber: string = chamberMapper(
    person.jurisdiction.classification,
    person.current_role.org_classification
  );

  return {
    id: person.name.replaceAll(".", "").replaceAll(" ", "-"),
    honorific_prefix: person.current_role.title,
    name: person.name,
    party: person.party,
    chamber: chamber,
    district: person.current_role.district,
  };
};

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
