import { Person } from 'popolo-types';

export interface Legislator extends Person {
  memberships: {
    organization_id: string;
    label: string;
    area_id: string;
  }[];
  sponsorships?: {
    billId: string;
    version: string;
    name: string;
  }[];
}

export const MEMBERS: Legislator[] = [
  {
    given_name: 'Jane',
    family_name: 'Doe',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '1',
      },
    ],
  },
  {
    given_name: 'John',
    family_name: 'Doe',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '2',
      },
    ],
  },
  {
    given_name: 'Jack',
    family_name: 'Horner',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '3',
      },
    ],
  },
  {
    given_name: 'Jill',
    family_name: 'Tate',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '4',
      },
    ],
  },
  {
    given_name: 'Joe',
    family_name: 'Guy',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '5',
      },
    ],
  },
  {
    given_name: 'Jim',
    family_name: 'Manly',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '6',
      },
    ],
  },
  {
    given_name: 'Jerry',
    family_name: 'Falwell',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '7',
      },
    ],
  },
  {
    given_name: 'Jeff',
    family_name: 'Comey',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '8',
      },
    ],
  },
  {
    given_name: 'Jenny',
    family_name: 'Ortega',
    memberships: [
      {
        organization_id: 'ASSEMBLY',
        label: 'chamber',
        area_id: '9',
      },
    ],
  },

  {
    given_name: 'Jimminy',
    family_name: 'Cricket',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '1',
      },
    ],
  },
  {
    given_name: 'John',
    family_name: 'Mulaney',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '1',
      },
    ],
  },
  {
    given_name: 'Jack',
    family_name: 'Reacher',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '1',
      },
    ],
  },
  {
    given_name: 'Jill',
    family_name: 'Stein',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '1',
      },
    ],
  },
  {
    given_name: 'Joe',
    family_name: 'Montagna',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '1',
      },
    ],
  },
  {
    given_name: 'Jim',
    family_name: 'Fix',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '2',
      },
    ],
  },
  {
    given_name: 'Jerry',
    family_name: 'Seinfeld',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '3',
      },
    ],
  },
  {
    given_name: 'Jeff',
    family_name: 'Block',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '4',
      },
    ],
  },
  {
    given_name: 'Jenny',
    family_name: 'Lane',
    memberships: [
      {
        organization_id: 'SENATE',
        label: 'chamber',
        area_id: '5',
      },
    ],
  },
];
