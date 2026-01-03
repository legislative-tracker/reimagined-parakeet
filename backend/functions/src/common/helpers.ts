import {
  Legislator,
  Legislation,
  LegislatureUpdateFnMap,
} from "../models/legislature";
import { OSPerson } from "../apis/open-states/types";
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

export const mapPersonToLegislator = (person: OSPerson): Legislator => {
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

export const isImageLink = (link: string | undefined): boolean => {
  if (!link) return false;
  if (!link.includes("https://")) return false;
  if (link?.includes("no_image")) return false;
  return true;
};

export const isEmail = (email: string | undefined): boolean => {
  if (!email?.trim()) return false;
  if (email.includes("https://")) return false;
  return true;
};
