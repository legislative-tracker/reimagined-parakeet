import type { Extras, Link } from './common.model';
import type { OrganizationStub } from './organization.model';
import type { PersonStub } from './person.model';

export type VoteEventStub = {
  id: string;
  motion_text: string;
};

export interface VoteEvent extends VoteEventStub {
  motion_classification?: string[];
  start_date: string;
  result: string;
  identifier: string;
  extras: Extras;
  organization: OrganizationStub;
  votes: {
    id: string;
    option: string;
    voter_name: string;
    voter: PersonStub;
  }[];
  counts: {
    option: string;
    value: number;
  }[];
  sources: Link[];
}
