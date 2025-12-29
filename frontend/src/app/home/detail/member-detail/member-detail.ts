import { Component, input, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LegislatureService } from 'src/app/core/legislature-service';
import { TableComponent } from 'src/app/shared/table/table.component';
import { SPONSORSHIP_COLS } from '../columns';
import { Legislator } from '@models/legislature';

@Component({
  selector: 'app-member-detail',
  imports: [MatTabsModule, TableComponent, MatProgressSpinnerModule],
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
