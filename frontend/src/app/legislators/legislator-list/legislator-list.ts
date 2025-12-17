import { Component, input, computed, viewChild, effect } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ASSEMBLY_MEMBERS, SENATORS } from '../legislators';

@Component({
  selector: 'app-legislator-list',
  imports: [MatTableModule, MatSortModule, MatSort],
  templateUrl: './legislator-list.html',
  styleUrl: './legislator-list.sass',
})
export class LegislatorList {
  readonly displayedColumns: string[] = ['lname', 'fname', 'party', 'district'];
  chamber = input.required<string>();
  sort = viewChild(MatSort);
  dataSource = computed(() => {
    if (this.chamber() === 'assembly') {
      return new MatTableDataSource(ASSEMBLY_MEMBERS);
    } else {
      return new MatTableDataSource(SENATORS);
    }
  });

  constructor() {
    effect(() => {
      const sortDirective = this.sort();
      if (sortDirective) {
        this.dataSource().sort = sortDirective;
      }
    });
  }
}
