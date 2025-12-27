import { Component, input, inject, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { switchMap, filter, distinctUntilChanged } from 'rxjs/operators';

// Angular Material Imports
import { MatTabsModule } from '@angular/material/tabs';

// Project Imports
import { LegislatureService } from '@common/legislature-service';
import { TableComponent } from '@common/table/table.component';
import { BILL_COLS, MEMBER_COLS } from '@models/column-config';

@Component({
  selector: 'app-view',
  imports: [CommonModule, MatTabsModule, TableComponent],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  // Inputs
  state = input.required<string>();

  // Services
  private legislatureService = inject(LegislatureService);

  // State Signals
  selectedTabIndex = signal(0);

  // Config
  billCols = BILL_COLS;
  memberCols = MEMBER_COLS;

  // --- Triggers ---
  // These compute an object that updates whenever State changes OR the specific Tab becomes active.

  private billsTrigger$ = computed(() => ({
    state: this.state(),
    // We want bills when tab is 0
    active: this.selectedTabIndex() === 0,
  }));

  private membersTrigger$ = computed(() => ({
    state: this.state(),
    // We want members when tab is 1 (Assembly) or 2 (Senate)
    active: this.selectedTabIndex() === 1 || this.selectedTabIndex() === 2,
  }));

  // --- Data Signals ---

  bills = toSignal(
    toObservable(this.billsTrigger$).pipe(
      filter((t) => t.active),
      distinctUntilChanged((prev, curr) => prev.state === curr.state),
      switchMap((t) => this.legislatureService.getBillsByState(t.state))
    ),
    { initialValue: [] }
  );

  members = toSignal(
    toObservable(this.membersTrigger$).pipe(
      filter((t) => t.active),
      distinctUntilChanged((prev, curr) => prev.state === curr.state),
      switchMap((t) => this.legislatureService.getMembersByState(t.state))
    ),
    { initialValue: [] }
  );

  // --- Derived State ---

  senateMembers = computed(() => {
    return this.members()?.filter((m) => m.chamber === 'SENATE') ?? [];
  });

  assemblyMembers = computed(() => {
    return this.members()?.filter((m) => m.chamber === 'ASSEMBLY') ?? [];
  });

  // --- Event Handlers ---

  onTabChange(index: number) {
    this.selectedTabIndex.set(index);
  }
}
