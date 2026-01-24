import type { Cosponsor, Legislation } from './legislation.model';
import type { Legislator, Sponsorship } from './legislator.model';

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
  { key: 'current_version', label: 'Current Version' },
  { key: 'title', label: 'Title' },
  { key: 'created_at', label: 'Published' },
];

export const MEMBER_COLS: ColumnConfig<Legislator>[] = [
  { key: 'family_name', label: 'Last Name' },
  { key: 'given_name', label: 'First Name' },
  { key: 'party', label: 'Party' },
  { key: 'district', label: 'District' },
];

export const COSPONSOR_COLS: ColumnConfig<Cosponsor>[] = [
  { key: 'name', label: 'Name' },
  { key: 'district', label: 'District' },
];

export const SPONSORSHIP_COLS: ColumnConfig<Sponsorship>[] = [
  { key: 'id', label: 'Bill Id' },
  { key: 'version', label: 'Version' },
  { key: 'title', label: 'Title' },
];
