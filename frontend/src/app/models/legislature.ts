import { Person, Motion, Identifier } from 'popolo-types';

export interface Legislator extends Person {
  id: string;
  honorific_prefix: string;
  party: string;
  chamber: string;
  district: string;
  sponsorships?: Sponsorship[];
}

export interface Legislation extends Motion {
  id: string;
  title?: string;
  version?: string;
  cosponsors?: {
    [key: string]: Identifier[];
  };
}

export type Sponsorship = {
  id: string;
  version: string;
  title: string;
};

export type Cosponsor = {
  id: string;
  name: string;
  chamber: string;
  district: string;
};
