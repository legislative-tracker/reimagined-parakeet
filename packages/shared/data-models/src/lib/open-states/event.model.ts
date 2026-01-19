import type { BillStub } from './bill.model';
import type { Document, Extras, Link, Media } from './common.model';
import type { JurisdictionStub } from './jurisdiction.model';
import type { OrganizationStub } from './organization.model';
import type { PersonStub } from './person.model';
import type { VoteEventStub } from './vote-event.model';

export type EventStub = {
  id: string;
  name: string;
  jurisdiction: JurisdictionStub;
  description: string;
  classification: 'event';
  start_date: string;
  end_date: string;
  all_day: boolean;
  status: string;
  upstream_id: string;
  deleted: boolean;
  location: {
    name: string;
    url: string;
  };
};

export interface Event extends EventStub {
  links?: Link[];
  sources?: Link[];
  media?: Document[];
  documents?: Document[];
  participants?: {
    note: string;
    name: string;
    entity_type: 'person' | 'organization';
    person?: PersonStub;
    organization?: OrganizationStub;
  }[];
  agenda?: {
    description: string;
    classification: string[];
    order: number;
    subjects: unknown[];
    notes: unknown[];
    extras: Extras;
    related_entities: {
      note: string;
      name: string;
      entity_type: 'person' | 'organization' | 'bill' | 'vote';
      person?: PersonStub;
      organization?: OrganizationStub;
      bill?: BillStub;
      vote?: VoteEventStub;
    }[];
    media: Media[];
  }[];
}
