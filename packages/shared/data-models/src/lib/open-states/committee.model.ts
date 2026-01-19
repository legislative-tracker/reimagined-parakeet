import type { Extras, Link } from './common.model';
import type { PersonStub } from './person.model';

export type CommitteeStub = {
  id: string;
  name: string;
  classification: 'committee' | 'subcommittee';
  parent_id: string;
  extras: Extras;
};

export interface Committee extends CommitteeStub {
  memberships?: {
    person_name: string;
    role: string;
    person: PersonStub;
  };
  links?: Link[];
  sources?: Link[];
}
