import type { Bill } from '../types/bills.js';
import type { Member } from '../types/members.js';
import type {
  Cosponsor,
  Cosponsorship,
} from '@legislative-tracker/shared-data-models';

export const mapToCosponsorships = (b: Bill): Cosponsorship => {
  const cosponsorsByVersion: Cosponsorship = {};
  const amendmentVersions: string[] = b.amendmentVersions.items;

  amendmentVersions.forEach((v: string) => {
    const cosponsors: Cosponsor[] = [];

    if (b.amendments.items[v] && b.amendments.items[v].coSponsors) {
      b.amendments.items[v].coSponsors.items.forEach((c: Member) =>
        cosponsors.push({
          id: c.fullName.replaceAll('.', '').replaceAll(' ', '-'),
          name: c.fullName,
          district: c.districtCode.toString(),
        }),
      );
    }
    cosponsorsByVersion[v === '' ? 'Original' : v] = cosponsors;
  });

  return cosponsorsByVersion;
};
