import { Component, input, inject, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

// Test
import { effect, untracked } from '@angular/core';

// Angular Material Imports
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Project Imports
import { LegislatureService } from '@common/legislature-service';
import { TableComponent } from '@common/table/table.component';
import { BILL_COLS, MEMBER_COLS } from '@models/column-config';

@Component({
  selector: 'app-view',
  imports: [CommonModule, MatTabsModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
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

  // --- Resources (Data Fetchers) ---

  billsResource = rxResource({
    // v20 CHANGE: 'request' -> 'params'
    params: () => this.billsRequest(),

    // v20 CHANGE: 'loader' -> 'stream'
    // Also destructure 'params' instead of 'request'
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

  constructor() {
    effect(() => {
      // 1. Log the Input Signal
      const currentState = this.stateCd();
      console.log('🔍 Current State Input:', currentState);

      // 2. Log the Request Signal (Computed)
      const req = this.billsRequest();
      console.log('🔍 Bills Request Param:', req);

      // 3. Log the Resource State
      // We use untracked() for the resource values to avoid infinite loops if we were writing signals,
      // but here it helps to just see the snapshot when other things change.
      console.log('Resource Status:', {
        isLoading: this.billsResource.isLoading(),
        error: this.billsResource.error(),
        hasValue: !!this.billsResource.value(),
        valueLength: this.billsResource.value()?.length,
      });
    });
  }
}
