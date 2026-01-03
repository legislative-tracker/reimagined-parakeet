import { Person, Motion, Identifier } from "popolo-types";

export interface Legislator extends Person {
  id: string;
  honorific_prefix: string;
  party?: string;
  chamber: string;
  district: string;
  sponsorships?: {
    id: string;
    version: string;
    title: string;
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

export type Legislature = {
  name: string;
};

export interface LegislatureUpdateFnMap<T> {
  [key: string]: {
    bills: (list: string[]) => Promise<T>;
    members: () => Promise<T>;
  };
}
