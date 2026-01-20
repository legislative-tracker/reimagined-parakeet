import type { Items } from './common.js';

export type LawDocument = {
  lawId: string;
  lawName: string;
  locationId: string;
  title: string;
  doctype: string;
  docLevelId: string;
  activeDate: string;
  sequenceNo: number;
  repealedDate: string | null;
  fromSection: string;
  toSection: string;
  text: string | null;
  documents: Items<LawDocument>;
  repealed: boolean;
};
export type Law = {
  lawVersion: {
    lawId: string;
    activeDate: string;
  };
  info: {
    lawId: string;
    name: string;
    lawType: string;
    chapter: string;
  };
  publishedDates: string[];
  documents: Items<LawDocument>;
};
