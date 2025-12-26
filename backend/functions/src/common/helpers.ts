import { HttpsError } from "firebase-functions/v2/https";
import got from "got";

import {
  Legislator,
  Legislation,
  LegislatureUpdateFnMap,
} from "../models/legislature";
import { OpenStatesPerson } from "../models/openstates-person";
import { GoogleGeocodingResponse } from "../models/geocode";
import { Success, ChamberMapping } from "../models/assorted";

import * as ny from "../ny/functions";

export const isSuccess = <T>(res: unknown): res is Success<T> => {
  if ((res as Success<T>).results) return true;
  return false;
};

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

const updateFnMap: LegislatureUpdateFnMap<Legislation[] | Legislator[]> = {
  ny: {
    bills: ny.updateBills,
    members: ny.updateMembers,
  },
};

export const getBillUpdates = async (o: { id: string; bills: string[] }) => {
  const updateFn = updateFnMap[o.id].bills;

  return {
    id: o.id,
    bills: await updateFn(o.bills),
  };
};
