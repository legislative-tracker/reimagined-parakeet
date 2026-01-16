import { Component, input, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LegislatureService } from '../../../core/services/legislature.service';
import { TableComponent } from '../../../shared/table/table.component';
import { SPONSORSHIP_COLS } from '../../../models/column-config';
import { Legislator } from '../../../models/legislature';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback';

@Component({
  selector: 'app-member-detail',
  imports: [
    MatIconModule,
    MatListModule,
    MatTabsModule,
    TableComponent,
    MatProgressSpinnerModule,
    ImgFallbackDirective,
  ],
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
