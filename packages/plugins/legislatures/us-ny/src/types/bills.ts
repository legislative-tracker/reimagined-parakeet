import type { Member, SessionMember } from './members.js';
import type { Committee } from './committees.js';
import type { Items } from './common.js';

export type ShortBillId = {
  basePrintNo: string;
  session: number;
  basePrintNoStr: string;
};
export interface BillId extends ShortBillId {
  printNo: string;
  version: string;
}
export type BillType = {
  chamber: 'ASSEMBLY' | 'SENATE';
  desc: string;
  resolution: boolean;
};
export type BillStatus = {
  statusType: string;
  statusDesc: string;
  actionDate: string;
  committeeName: string;
  billCalNo: number;
};
export type BillActionItem = {
  billId: BillId;
  date: string;
  chamber: 'SENATE' | 'ASSEMBLY';
  sequenceNo: number;
  text: string;
};
export interface BillInfo extends ShortBillId {
  printNo: string;
  billType: BillType;
  title: string;
  activeVersion: string;
  publishedDateTime: string;
  substitutedBy: string | null;
  sponsor: {
    member: Member;
    budget: boolean;
    rules: boolean;
    redistricting: boolean;
  };
  reprintOf: string | null;
  summary: string;
  signed: boolean;
  adpoted: boolean;
  vetoed: boolean;
  status: BillStatus;
  milestones: {
    items: BillStatus[];
    size: number;
  };
  actions: {
    items: BillActionItem[];
    size: number;
  };
  publishStatusMap: {
    items: {
      [key: string]: {
        version: string;
        published: boolean;
        effectDateTime: string;
      };
    };
    size: number;
  };
  programInfo: null; //TODO: find out what this is
}
export interface BillAmendment extends ShortBillId {
  printNo: string;
  version: string;
  publishDate: string;
  sameAs: {
    items: []; //TODO: need examples
    size: number;
  };
  memo: string;
  lawSection: string;
  lawCode: string;
  actClause: string;
  fullTextFormats: string[];
  fullText?: string;
  fullTextHtml: string;
  fullTextTemplate: string;
  coSponsors: Items<Member>;
  multiSponsors: Items<Member>;
  uniBill: boolean;
  relatedLaws: {
    items: object; //TODO: need examples
    size: number;
  };
  stricken: boolean;
}
export interface Bill extends BillInfo {
  year: number;
  amendmentVersions: Items<string>;
  amendments: {
    items: {
      [key: string]: BillAmendment;
    };
    size: number;
  };
  votes: {
    items: []; //TODO: need examples
    size: number;
  };
  vetoMessages: {
    items: []; //TODO: need examples
    size: number;
  };
  approvalMessage: string | null;
  additionalSponsors: Items<SessionMember>;
  pastCommittees: Items<Committee>;
  previousVersions: Items<BillId>;
  committeeAgendas: {
    items: []; //TODO: complete after doing committees
    size: number;
  };
  calendars: {
    items: []; //TODO: complete after doing calendars
    size: number;
  };
  billInfoRefs?: {
    items: {
      [key: string]: BillInfo;
    };
    size: number;
  };
}
