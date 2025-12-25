export interface ColumnConfig {
  key: string; // Object property (e.g., 'billNumber')
  label: string; // Header text (e.g., 'Bill #')
}

export const LEGISLATOR_COLS: ColumnConfig[] = [
  { key: 'name', label: 'Name' },
  { key: 'chamber', label: 'Chamber' },
  { key: 'district', label: 'District' },
  { key: 'party', label: 'Party' },
];

export const BILL_COLS: ColumnConfig[] = [
  { key: 'id', label: 'Bill Number' },
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Published' },
  { key: 'version', label: 'Active Version' },
];

export const MEMBER_COLS: ColumnConfig[] = [
  { key: 'family_name', label: 'Last Name' },
  { key: 'given_name', label: 'First Name' },
  { key: 'party', label: 'Party' },
  { key: 'district', label: 'District' },
];
