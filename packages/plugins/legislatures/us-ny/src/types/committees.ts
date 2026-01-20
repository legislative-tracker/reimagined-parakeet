import type { Items } from './common.js';
import type { Member } from './members.js';

export interface CommitteeMember extends Member {
  sequenceNo: number;
  title: 'CHAIR' | 'MEMBER';
}

export type CommitteeId = {
  chamber: 'SENATE';
  name: string;
};

export type Committee = {
  chamber: 'SENATE';
  name: string;
  sessionYear: number;
  referenceDate: string;
  reformed: null; //TODO: find out what this is
  location: string;
  meetDay: string;
  meetTime: string;
  meetAltWeek: boolean;
  meetAltWeekText: string;
  committeeMembers: Items<CommitteeMember>;
};
