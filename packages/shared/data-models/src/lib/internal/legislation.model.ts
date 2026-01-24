import type { Bill } from '../open-states/bill.model';

export interface Legislation extends Bill {
  current_version: string;
  cosponsorships: Cosponsorship;
}

export type Cosponsorship = {
  [key: string]: Cosponsor[];
};

export type Cosponsor = {
  id: string;
  name: string;
  district: string;
};
