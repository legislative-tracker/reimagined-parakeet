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
