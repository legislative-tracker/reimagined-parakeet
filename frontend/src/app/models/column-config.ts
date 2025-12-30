import { Identifier } from 'popolo-types';
import { Legislation, Legislator } from './legislature';

export interface ColumnConfig<T> {
  key: keyof T & string; // Object property (e.g., 'billNumber')
  label: string; // Header text (e.g., 'Bill #')
}

export const LEGISLATOR_COLS: ColumnConfig<Legislator>[] = [
  { key: 'name', label: 'Name' },
  { key: 'chamber', label: 'Chamber' },
  { key: 'district', label: 'District' },
  { key: 'party', label: 'Party' },
];

export const BILL_COLS: ColumnConfig<Legislation>[] = [
  { key: 'id', label: 'Bill Number' },
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Published' },
  { key: 'version', label: 'Active Version' },
];

export const MEMBER_COLS: ColumnConfig<Legislator>[] = [
  { key: 'family_name', label: 'Last Name' },
  { key: 'given_name', label: 'First Name' },
  { key: 'party', label: 'Party' },
  { key: 'district', label: 'District' },
];

export const COSPONSOR_COLS: ColumnConfig<Identifier>[] = [
  { key: 'identifier', label: 'Legislator Id' },
];

export const SPONSORSHIP_COLS: ColumnConfig<Identifier>[] = [
  { key: 'identifier', label: 'Bill Id' },
];
