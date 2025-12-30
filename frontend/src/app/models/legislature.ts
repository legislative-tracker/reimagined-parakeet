import { Person, Motion, Identifier } from 'popolo-types';

export interface Legislator extends Person {
  id: string;
  honorific_prefix: string;
  party: string;
  chamber: string;
  district: string;
  sponsorships?: Identifier[];
}

export interface Legislation extends Motion {
  id: string;
  title?: string;
  version?: string;
  cosponsors?: {
    [key: string]: Identifier[];
  };
}
