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
