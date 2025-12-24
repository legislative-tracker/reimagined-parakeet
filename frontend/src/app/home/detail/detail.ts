import { Component, input, inject, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { MatTabsModule } from '@angular/material/tabs';

import { LegislatureService } from '@common/legislature-service';
import { TableComponent } from '@common/table/table.component';
import { COSPONSOR_COLS, SPONSORSHIP_COLS } from './columns';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, MatTabsModule, TableComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail {
  state = input.required<string>();
  id = input.required<string>();
  private legislatureService = inject(LegislatureService);

  cosponsorCols = COSPONSOR_COLS;
  sponsorshipCols = SPONSORSHIP_COLS;

  billDetails = toSignal(
    combineLatest([toObservable(this.state), toObservable(this.id)]).pipe(
      switchMap(([stateCode, billId]) => this.legislatureService.getBillById(stateCode, billId))
    )
  );

  billVersions = computed(() => {
    const versions = this.billDetails()?.cosponsors;
    if (!versions) return [];

    return Object.entries(versions).map(([key, data]: [string, any]) => ({
      id: key,
      data: data,
    }));
  });

  memberDetails = toSignal(
    combineLatest([toObservable(this.state), toObservable(this.id)]).pipe(
      switchMap(([stateCode, memberId]) =>
        this.legislatureService.getMemberById(stateCode, memberId)
      )
    ),
    { initialValue: [] }
  );

  sponsorships = computed(() => {
    const bills = this.memberDetails()?.sponsorships;
    if (!bills) return [];

    return bills;
  });
}
