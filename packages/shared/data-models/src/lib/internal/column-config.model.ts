export interface ColumnConfig<T> {
  key: keyof T & string; // Object property (e.g., 'billNumber')
  label: string; // Header text (e.g., 'Bill #')
}
