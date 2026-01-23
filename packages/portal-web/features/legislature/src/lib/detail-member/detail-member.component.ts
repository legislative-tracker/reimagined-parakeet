import { Component, input, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LegislatorService } from '@legislative-tracker/portal-web-data-access-legislature';
import { TableComponent } from '@legislative-tracker/portal-web-ui';
import {
  type Legislator,
  SPONSORSHIP_COLS,
} from '@legislative-tracker/shared-data-models';
import { ImgFallbackDirective } from '';

@Component({
  selector: 'lib-detail-member',
  imports: [
    MatIconModule,
    MatListModule,
    MatTabsModule,
    TableComponent,
    MatProgressSpinnerModule,
    ImgFallbackDirective,
  ],
  templateUrl: './detail-member.component.html',
  styleUrls: ['./detail-member.component.scss'],
})
export class MemberDetailComponent {
  stateCd = input.required<string>();
  id = input.required<string>(); // The Member ID

  private legislatorService = inject(LegislatorService);
  sponsorshipCols = SPONSORSHIP_COLS;

  memberResource = rxResource({
    params: () => ({ state: this.stateCd(), id: this.id() }),
    stream: ({ params }) =>
      this.legislatorService.getMemberById(params.state, params.id),
  });

  member = computed(
    () => this.memberResource.value() as Legislator | undefined,
  );

  sponsorships = computed(() => this.member()?.sponsorships ?? []);
}
