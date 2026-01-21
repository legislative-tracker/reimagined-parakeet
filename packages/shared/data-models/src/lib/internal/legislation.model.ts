import type { Bill } from '../open-states/bill.model';

export interface Legislation extends Bill {
  current_version: string;
  cosponsorships: {
    [key: string]: {
      id: string;
      name: string;
    }[];
  };
}
