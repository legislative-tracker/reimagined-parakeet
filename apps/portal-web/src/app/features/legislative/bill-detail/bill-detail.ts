import { Component, input, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// App Imports
import { LegislatureService } from '../../../core/services/legislature.service';
import { TableComponent } from '../../../shared/table/table.component';
import { COSPONSOR_COLS } from '../../../models/column-config';
import { Legislation } from '../../../models/legislature';

@Component({
  selector: 'app-bill-detail',
  imports: [MatTabsModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './bill-detail.html',
  styleUrls: ['./bill-detail.scss'],
})
export class BillDetail {
  stateCd = input.required<string>(); // two-letter region abbreviation
  id = input.required<string>(); // The Bill ID

  private legislatureService = inject(LegislatureService);
  cosponsorCols = COSPONSOR_COLS;

  // Single dedicated resource for this bill
  billResource = rxResource({
    params: () => ({ state: this.stateCd(), id: this.id() }),
    stream: ({ params }) => this.legislatureService.getBillById(params.state, params.id),
  });

  bill = computed(() => this.billResource.value() as Legislation | undefined);

  // Transform logic specifically for Bill versions
  billVersions = computed(() => {
    const b = this.bill();
    if (!b?.cosponsors) return [];
    return Object.entries(b.cosponsors).map(([key, data]) => ({
      id: key,
      data: data,
    }));
  });
}
