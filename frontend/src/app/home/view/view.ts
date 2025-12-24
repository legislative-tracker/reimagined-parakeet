import { Component, input, inject, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { MatTabsModule } from '@angular/material/tabs';

import { LegislatureService } from '@common/legislature-service';
import { TableComponent } from '@common/table/table.component';
import { BILL_COLS, MEMBER_COLS } from './columns';

@Component({
  selector: 'app-view',
  imports: [CommonModule, MatTabsModule, TableComponent],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  state = input.required<string>();
  private legislatureService = inject(LegislatureService);

  billCols = BILL_COLS;
  memberCols = MEMBER_COLS;

  bills = toSignal(
    toObservable(this.state).pipe(
      switchMap((stateCode) => this.legislatureService.getBillsByState(stateCode))
    ),
    { initialValue: [] }
  );

  members = toSignal(
    toObservable(this.state).pipe(
      switchMap((stateCode) => this.legislatureService.getMembersByState(stateCode))
    ),
    { initialValue: [] }
  );

  senateMembers = computed(() => this.members().filter((m) => m.chamber === 'SENATE'));
  assemblyMembers = computed(() => this.members().filter((m) => m.chamber === 'ASSEMBLY'));
}
