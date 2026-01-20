import type { Items } from './common.js';
import type { BillInfo } from './bills.js';

export type Calendar<T> = {
  year: number;
  calendarNumber: number;
  floorCalendar: T;
  supplementalCalendars: Items<T>;
  activeLists: Items<T>;
  calDate: string;
};

export type ShortCalendar = {
  year: number;
  calendarNumber: number;
  version: string;
  calDate: string;
  releaseDateTime: string;
  totalEntries: number;
};

export interface CalendarEntry extends BillInfo {
  billCalNo: number;
  selectedVersion: string;
  sectionType: string;
  subBillInfo: null; //TODO: find out what this is
  billHigh: boolean;
}

export interface FullCalendar extends ShortCalendar {
  entriesBySection: {
    items: {
      [key: string]: {
        items: CalendarEntry[];
        size: number;
      };
    };
    size: number;
  };
}
