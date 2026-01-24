import type { Person } from '../open-states/person.model';

export interface Legislator extends Person {
  chamber: string;
  district: string;
  sort_name: string;

  sponsorships?: Sponsorship[];
}

export type Sponsorship = {
  id: string;
  version: string;
  title: string;
};
