import type { Person } from '../open-states/person.model';

export interface Legislator extends Person {
  sort_name: string;

  sponsorships?: {
    id: string;
    version: string;
    title: string;
  };
}
