import {
  Legislator,
  Legislation,
  LegislatureUpdateFnMap,
} from "../models/legislature";
import { Person } from "@jpstroud/opencivicdata-types";
import { Success, ChamberMapping } from "../models/assorted";

import * as ny from "../apis/ny/functions";

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
    // TODO: refactor when implementing a state with different names
    upper: "Senate",
    lower: "Assembly",
  },
};

const chamberMapper = (jurisdiction: string, org: string): string => {
  return chamberMapping[jurisdiction][org];
};

export const mapPersonToLegislator = (person: Person): Partial<Legislator> => {
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
    bills: (await updateFn(o.bills)) as Legislation[],
  };
};

export const getMemberUpdates = async (
  legislature: string
): Promise<Legislator[]> => {
  const updateFn = updateFnMap[legislature].members;

  return (await updateFn()) as Legislator[];
};

export const isImageLink = (urlStr: string | undefined): boolean => {
  if (!urlStr || typeof urlStr !== "string") return false;

  try {
    const url = new URL(urlStr);
    if (!["http:", "https:"].includes(url.protocol)) return false;

    const imageExtensions = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i;
    return imageExtensions.test(url.pathname);
  } catch (e) {
    return false;
  }
};
export const isEmail = (email: string | undefined): boolean => {
  if (!email || typeof email !== "string") return false;
  const cleanEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleanEmail);
};
