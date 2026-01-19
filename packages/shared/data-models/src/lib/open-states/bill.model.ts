import type { Document, Extras, Identifier, Link } from './common.model';
import type { JurisdictionStub } from './jurisdiction.model';
import type { OrganizationStub } from './organization.model';
import type { PersonStub } from './person.model';

export type BillStub = {
  id: string;
  session: string;
  identifier: string;
  title: string;
};

export interface Bill extends BillStub {
  jurisdiction: JurisdictionStub;
  from_organization: OrganizationStub;
  classification: string[];
  subject: unknown[];
  extras: Extras;
  created_at: string;
  updated_at: string;
  openstates_url: string;
  first_action_date: string;
  latest_action_date: string;
  latest_action_description: string;
  latest_passage_date: string;
  related_bills?: {
    identifier: string;
    legislative_session: string;
    relation_type: string;
  }[];
  abstracts?: {
    abstract: string;
    note: string;
  }[];
  other_titles?: unknown[];
  other_identifiers?: Identifier[];
  sponsorships?: {
    id: string;
    name: string;
    entity_type: 'person' | 'organization';
    primary: boolean;
    classification: string;
    person?: PersonStub;
    organization?: OrganizationStub;
  }[];
  actions: {
    id: string;
    organization: OrganizationStub;
    description: string;
    date: string;
    classification: string[];
    order: number;
    related_entities?: {
      name: string;
      entity_type: string;
      organization?: OrganizationStub;
      person?: PersonStub;
    }[];
  }[];
  sources?: Link[];
  versions?: Document[];
  documents?: Document[];
  votes?: {
    id: string;
    motion_text: string;
    motion_classification: string[];
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
  }[];
}
