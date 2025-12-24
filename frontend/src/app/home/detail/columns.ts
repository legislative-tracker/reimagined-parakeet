export interface ColumnConfig {
  key: string; // Object property (e.g., 'billNumber')
  label: string; // Header text (e.g., 'Bill #')
}

export const COSPONSOR_COLS: ColumnConfig[] = [{ key: 'identifier', label: 'Legislator Id' }];

export const SPONSORSHIP_COLS: ColumnConfig[] = [{ key: 'identifier', label: 'Bill Id' }];
