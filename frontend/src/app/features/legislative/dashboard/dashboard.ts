import { Component, input, inject, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

// Angular Material Imports
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Project Imports
import { LegislatureService } from 'src/app/core/services/legislature.service';
import { TableComponent } from 'src/app/shared/table/table.component';
import { BILL_COLS, MEMBER_COLS } from '@models/column-config';

@Component({
  selector: 'app-dashboard',
  imports: [MatTabsModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stateCd = input.required<string>();
  private legislatureService = inject(LegislatureService);

  selectedTabIndex = signal(0);
  billCols = BILL_COLS;
  memberCols = MEMBER_COLS;

  // --- Request Signals (Triggers) ---

  // Computes the active state for bills, or null if inactive
  private billsRequest = computed(() => (this.selectedTabIndex() === 0 ? this.stateCd() : null));

  // Computes the active state for members, or null if inactive
  private membersRequest = computed(() =>
    [1, 2].includes(this.selectedTabIndex()) ? this.stateCd() : null
  );

  // --- Resources ---

  billsResource = rxResource({
    params: () => this.billsRequest(),

    stream: ({ params: stateCode }: { params: string | null }) => {
      if (!stateCode) return of([]);
      return this.legislatureService.getBillsByState(stateCode);
    },
  });

  membersResource = rxResource({
    params: () => this.membersRequest(),
    stream: ({ params: stateCode }: { params: string | null }) => {
      if (!stateCode) return of([]);
      return this.legislatureService.getMembersByState(stateCode);
    },
  });

  // --- Derived State ---

  bills = computed(() => this.billsResource.value() ?? []);
  members = computed(() => this.membersResource.value() ?? []);

  senateMembers = computed(() => this.members().filter((m) => m.chamber === 'SENATE'));
  assemblyMembers = computed(() => this.members().filter((m) => m.chamber === 'ASSEMBLY'));

  onTabChange(index: number) {
    this.selectedTabIndex.set(index);
  }
}
