import { Component, input, computed } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { RouterLink } from '@angular/router';

export interface ColumnConfig {
  key: string; // Object property (e.g., 'billNumber')
  label: string; // Header text (e.g., 'Bill #')
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  imports: [MatTableModule, MatSortModule, RouterLink],
})
export class TableComponent {
  dataSource = input.required<any[]>();
  columnSource = input.required<ColumnConfig[]>();
  chamber = input<'SENATE' | 'ASSEMBLY'>();
  stateCd = input<string>(''); // Passed from parent or route
  routeType = input<'bill' | 'member'>('bill');

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = computed(() => this.columnSource().map((c) => c.key));

  testClick(row: any) {
    console.log('Row clicked!', row);
    console.log('Target State:', this.stateCd());
    console.log('Target ID:', row.id);
  }
}
