import type { Bill } from '../types/bills.js';
import type { Legislation } from '@legislative-tracker/shared-data-models';
import { mapToCosponsorships } from './map-cosponsorships.js';

export const mapToLegislation = (bill: Bill): Partial<Legislation> => {
  const now = new Date().toISOString();

  return {
    id: bill.basePrintNoStr,
    title: bill.title,
    identifier: bill.printNo,
    classification: ['bill'],
    current_version: bill.activeVersion,
    created_at: bill.publishedDateTime,
    updated_at: now,
    latest_action_date: bill.status.actionDate,
    latest_action_description: bill.status.statusDesc,
    cosponsorships: mapToCosponsorships(bill),
    sponsorships: [
      {
        id: bill.sponsor.member.fullName
          .replaceAll(' ', '-')
          .replaceAll('.', ''),
        name: bill.sponsor.member.fullName,
        classification: 'primary',
        entity_type: 'person',
        primary: true,
      },
    ],
    abstracts: [
      {
        abstract: bill.summary,
        note: 'Bill summary',
      },
    ],
  };
};
