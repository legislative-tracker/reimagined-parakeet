import { Component, input, inject, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

// Angular Material Imports
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// App Imports
import {
  LegislationService,
  LegislatorService,
} from '@legislative-tracker/portal-web-data-access-legislature';
import { TableComponent } from '@legislative-tracker/portal-web-ui';
import {
  BILL_COLS,
  MEMBER_COLS,
} from '@legislative-tracker/shared-data-models';

enum DashboardTab {
  Bills = 0,
  Senate = 1,
  Assembly = 2,
}

@Component({
  selector: 'lib-dashboard',
  imports: [MatTabsModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  stateCd = input.required<string>();
  private legislationService = inject(LegislationService);
  private legislatorService = inject(LegislatorService);

  selectedTabIndex = signal<DashboardTab>(DashboardTab.Bills);

  Tab = DashboardTab;
  billCols = BILL_COLS;
  memberCols = MEMBER_COLS;

  // --- Request Signals (Triggers) ---

  // Computes the active state for bills, or null if inactive
  private billsRequest = computed(() =>
    this.selectedTabIndex() === DashboardTab.Bills ? this.stateCd() : null,
  );

  // Computes the active state for members, or null if inactive
  private membersRequest = computed(() =>
    [DashboardTab.Senate, DashboardTab.Assembly].includes(
      this.selectedTabIndex(),
    )
      ? this.stateCd()
      : null,
  );

  // --- Resources ---

  billsResource = rxResource({
    params: () => this.billsRequest(),

    stream: ({ params: stateCode }: { params: string | null }) => {
      if (!stateCode) return of([]);
      return this.legislationService.getBillsByState(stateCode);
    },
  });

  membersResource = rxResource({
    params: () => this.membersRequest(),
    stream: ({ params: stateCode }: { params: string | null }) => {
      if (!stateCode) return of([]);
      return this.legislatorService.getMembersByState(stateCode);
    },
  });

  // --- Derived State ---
  bills = computed(() => this.billsResource.value() ?? []);
  members = computed(() => this.membersResource.value() ?? []);

  isLoading = computed(
    () => this.billsResource.isLoading() || this.membersResource.isLoading(),
  );
  error = computed(
    () => this.billsResource.error() || this.membersResource.error(),
  );

  senateMembers = computed(() =>
    this.members().filter((m) => m.current_role.org_classification === 'upper'),
  );
  assemblyMembers = computed(() =>
    this.members().filter((m) => m.current_role.org_classification === 'lower'),
  );

  onTabChange(index: number) {
    this.selectedTabIndex.set(index as DashboardTab);
  }
}
