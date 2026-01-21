import type { Bill } from '../types/bills.js';
import type { Member } from '../types/members.js';

type Cosponsor = {
  id: string;
  name: string;
};

type Cosponsorship = {
  [key: string]: Cosponsor[];
};

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
        }),
      );
    }
    cosponsorsByVersion[v === '' ? 'Original' : v] = cosponsors;
  });

  return cosponsorsByVersion;
};
