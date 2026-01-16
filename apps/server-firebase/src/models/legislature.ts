import { Person, Bill } from "@jpstroud/opencivicdata-types";

export interface Legislator extends Person {
  honorific_prefix: string;
  honorific_suffix: string;
  chamber: string;
  district: string;
  additional_name: string;
  sort_name: string;

  sponsorships?: {
    id: string;
    version: string;
    title: string;
  }[];
}

export interface Legislation extends Bill {
  current_version: string;
  text: string;
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
