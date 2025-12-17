import { Component, input, computed, viewChild, effect } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { BILLS } from '../bills';

@Component({
  selector: 'app-bill-list',
  imports: [MatTableModule, MatSortModule, MatSort],
  templateUrl: './bill-list.html',
  styleUrl: './bill-list.sass',
})
export class BillList {
  readonly displayedColumns: string[] = ['id', 'title', 'activeVersion', 'publishedDateTime'];
  sort = viewChild(MatSort);
  dataSource = new MatTableDataSource(BILLS);

  constructor() {
    effect(() => {
      const sortDirective = this.sort();
      if (sortDirective) {
        this.dataSource.sort = sortDirective;
      }
    });
  }
}
