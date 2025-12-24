import { Person } from "popolo-types";

export interface Legislator extends Person {
  id: string;
  honorific_prefix: string;
  party?: string;
  chamber: string;
  district: string;
  sponsorships?: {
    billId: string;
    version: string;
    name: string;
  }[];
}
