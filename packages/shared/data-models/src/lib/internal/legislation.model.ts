import type { Bill } from '../open-states/bill.model';

export interface Legislation extends Bill {
  current_version: string;
}
