import type { FullMember } from '../types/members.js';
import type { Legislator } from '@legislative-tracker/shared-data-models';
import { isImage, isEmail } from '@legislative-tracker/plugin-shared-utils';

const MEMBER_IMG_BASE_URL =
  'https://legislation.nysenate.gov/static/img/business_assets/members/mini/';

export const mapToLegislators = (
  members: FullMember[],
): Partial<Legislator>[] => {
  return members.map((member) => ({
    id: member.fullName.replaceAll(' ', '-').replaceAll('.', ''),
    given_name: member.person.firstName,
    family_name: member.person.lastName,
    name: member.fullName,
    image: isImage(member.imgName)
      ? MEMBER_IMG_BASE_URL + member.imgName
      : undefined,
    email: isEmail(member.person.email) ? member.person.email : undefined,
    current_role: {
      title: member.chamber === 'SENATE' ? 'Senator' : 'Assembly Member',
      district: `${member.districtCode}`,
      org_classification: member.chamber === 'SENATE' ? 'upper' : 'lower',
      division_id: `ocd-division/country:us/state:ny/${member.chamber === 'SENATE' ? 'sldu' : 'sldl'}:${member.districtCode}`,
    },
    jurisdiction: {
      id: 'ocd-jurisdiction/country:us/state:ny/government',
      name: 'New York',
      classification: 'state',
    },
    other_identifiers: [
      {
        scheme: 'ny_state_leg_session_id',
        identifier: member.sessionMemberId.toString(),
      },
      {
        scheme: 'ny_state_leg_session_short_name',
        identifier: member.shortName,
      },
    ],
  }));
};
