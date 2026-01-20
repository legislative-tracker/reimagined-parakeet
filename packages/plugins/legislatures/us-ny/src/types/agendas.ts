import type { ShortBillId, BillInfo, BillId } from './bills.js';
import type { CommitteeId } from './committees.js';
import type { Member } from './members.js';

export type Id = {
  number: number;
  year: number;
};

export type Summary = {
  id: Id;
  weekOf: string;
  publishedDateTime: string;
  totalAddendum: number;
  totalBillsConsidered: number;
  totalBillsVotedOn: number;
  totalCommittees: number;
};

export type Addendum = {
  agendaId: Id;
  addendumId: string;
  committeeId: CommitteeId;
  modifiedDateTime: string;
  hasVotes: boolean;
  meeting: {
    chair: string;
    location: string;
    meetingDateTime: string;
    notes: string;
  };
  bills: {
    items: [
      {
        billId: ShortBillId;
        billInfo: BillInfo;
        message: string;
      },
    ];
    size: number;
  };
  voteInfo: {
    attendanceList: {
      items: [
        {
          member: Member;
          rank: number;
          party: string;
          attend: string;
        },
      ];
      size: number;
    };
    votesList: {
      items: [
        {
          bill: BillId;
          action: string;
          amended: boolean;
          referCommittee: null; //TODO: find out what this is
          vote: {
            billId: BillId;
            version: string;
            voteType: string;
            sequenceNo: number;
            voteDate: string;
            committee: CommitteeId;
            memberVotes: {
              items: {
                [key: string]: {
                  items: Member[];
                  size: number;
                };
              };
              size: number;
            };
            attendance: {
              remote: {
                items: Member[];
                size: number;
              };
            };
          };
        },
      ];
      size: number;
    };
  };
  committeeAgendaAddendumId: {
    agendaId: Id;
    committeeId: CommitteeId;
    addendum: string;
  };
};

export interface Agenda extends Summary {
  committeeId: CommitteeId;
  committeeAgendas: {
    items: [
      {
        committeeId: CommitteeId;
        addenda: {
          items: Addendum[];
          size: number;
        };
      },
    ];
    size: number;
  };
}
