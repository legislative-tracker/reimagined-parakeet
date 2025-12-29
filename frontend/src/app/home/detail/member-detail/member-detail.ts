import { Component, input, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LegislatureService } from '@common/legislature-service';
import { TableComponent } from '@common/table/table.component';
import { SPONSORSHIP_COLS } from '../columns';
import { Legislator } from '@models/legislature';

@Component({
  selector: 'app-member-detail',
  imports: [CommonModule, MatTabsModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './member-detail.html',
  styleUrls: ['./member-detail.scss'],
})
export class MemberDetail {
  stateCd = input.required<string>();
  id = input.required<string>(); // The Member ID

  private legislatureService = inject(LegislatureService);
  sponsorshipCols = SPONSORSHIP_COLS;

  memberResource = rxResource({
    params: () => ({ state: this.stateCd(), id: this.id() }),
    stream: ({ params }) => this.legislatureService.getMemberById(params.state, params.id),
  });

  member = computed(() => this.memberResource.value() as Legislator | undefined);

  sponsorships = computed(() => this.member()?.sponsorships ?? []);
}
