import { Person, Motion, Identifier } from "popolo-types";

export interface Legislator extends Person {
  id: string;
  honorific_prefix: string;
  party?: string;
  chamber: string;
  district: string;
  sponsorships?: {
    billId: string;
    version: string;
    name: string;
  }[];
}

export interface Legislation extends Motion {
  id: string;
  title?: string;
  version?: string;
  cosponsors?: {
    [key: string]: Identifier[];
  };
}

export interface LegislatureUpdateFnMap<T> {
  [key: string]: {
    bills: (list: string[]) => Promise<T>;
    members: () => Promise<T>;
  };
}
