import { Component, input, computed, viewChild, effect } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MEMBERS, Legislator } from '../legislators';

@Component({
  selector: 'app-legislator-list',
  imports: [MatTableModule, MatSortModule, MatSort],
  templateUrl: './legislator-list.html',
  styleUrl: './legislator-list.sass',
})
export class LegislatorList {
  readonly displayedColumns: string[] = ['lname', 'fname', 'district', 'party'];
  chamber = input.required<string>();
  sort = viewChild(MatSort);
  dataSource = computed(() => {
    if (this.chamber() === 'ASSEMBLY') {
      return new MatTableDataSource(
        MEMBERS.filter((m) => m.memberships.some((ms) => ms.organization_id === 'ASSEMBLY'))
      );
    } else {
      return new MatTableDataSource(
        MEMBERS.filter((m) => m.memberships.some((ms) => ms.organization_id === 'SENATE'))
      );
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

  getDistrict(legislator: Legislator): string {
    const chamberMembership = legislator.memberships.find((ms) => ms.label === 'chamber');
    return chamberMembership ? chamberMembership.area_id : '';
  }
  getParty(legislator: Legislator): string {
    const partyMembership = legislator.memberships.find((ms) => ms.label === 'party');
    return partyMembership ? partyMembership.organization_id : '';
  }
}
