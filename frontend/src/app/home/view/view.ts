import { Component, input, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { MatTabsModule } from '@angular/material/tabs';

import { BillService } from '../../common/bill-service';
import { TableComponent } from '../../common/table/table.component';
import { BILL_COLS, MEMBER_COLS } from './columns';

@Component({
  selector: 'app-view',
  imports: [CommonModule, MatTabsModule, TableComponent],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  state = input.required<string>();
  private billService = inject(BillService);

  billCols = BILL_COLS;
  memberCols = MEMBER_COLS;

  bills = toSignal(
    toObservable(this.state).pipe(
      switchMap((stateCode) => this.billService.getBillsByState(stateCode))
    ),
    { initialValue: [] }
  );

  members = toSignal(
    toObservable(this.state).pipe(
      switchMap((stateCode) => this.billService.getMembersByState(stateCode))
    ),
    { initialValue: [] }
  );
}
