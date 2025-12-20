import { Component, inject, input, computed, viewChild, effect } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { BillService } from '../bill-service';
import { BILLS } from '../bills';

@Component({
  selector: 'app-bill-list',
  imports: [MatTableModule, MatSortModule, MatSort],
  templateUrl: './bill-list.html',
  styleUrl: './bill-list.sass',
})
export class BillList {
  protected readonly billService = inject(BillService);
  readonly displayedColumns: string[] = ['id', 'title', 'version', 'date'];

  sort = viewChild(MatSort);
  dataSource = new MatTableDataSource(BILLS);
  // dataSource = computed(() => {
  //   const data = this.billService.bills();
  //   return new MatTableDataSource(data);
  // });

  constructor() {
    effect(() => {
      const sortDirective = this.sort();
      if (sortDirective) {
        this.dataSource.sort = sortDirective;
      }
    });
  }
}
