import { Person, Motion } from "popolo-types";

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
    [key: string]: Cosponsor[];
  };
}

export type Cosponsor = {
  id: string;
  name: string;
  chamber: string;
  district: string;
};

export type Legislature = {
  name: string;
};

export interface LegislatureUpdateFnMap<T> {
  [key: string]: {
    bills: (list: string[]) => Promise<T>;
    members: () => Promise<T>;
  };
}
