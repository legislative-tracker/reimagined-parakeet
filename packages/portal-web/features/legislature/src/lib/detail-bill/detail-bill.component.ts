import { Component, input, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// App Imports
import { LegislationService } from '@legislative-tracker/portal-web-data-access-legislature';
import { TableComponent } from '@legislative-tracker/portal-web-ui';
import {
  type Legislation,
  COSPONSOR_COLS,
} from '@legislative-tracker/shared-data-models';

@Component({
  selector: 'lib-detail-bill',
  imports: [MatTabsModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './detail-bill.component.html',
  styleUrls: ['./detail-bill.component.scss'],
})
export class BillDetail {
  stateCd = input.required<string>(); // two-letter region abbreviation
  id = input.required<string>(); // The Bill ID

  private legislationService = inject(LegislationService);
  cosponsorCols = COSPONSOR_COLS;

  // Single dedicated resource for this bill
  billResource = rxResource({
    params: () => ({ state: this.stateCd(), id: this.id() }),
    stream: ({ params }) =>
      this.legislationService.getBillById(params.state, params.id),
  });

  bill = computed(() => this.billResource.value() as Legislation | undefined);

  // Transform logic specifically for Bill versions
  billVersions = computed(() => {
    const b = this.bill();
    if (!b?.cosponsorships) return [];
    return Object.entries(b.cosponsorships).map(([key, data]) => ({
      id: key,
      data: data,
    }));
  });
}
