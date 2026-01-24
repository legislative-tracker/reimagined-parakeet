import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { FirebaseApp } from '@angular/fire/app';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// App imports
import {
  LegislationService,
  LegislatureService,
} from '@legislative-tracker/portal-web-data-access-legislature';

import { AuthService } from '@legislative-tracker/portal-web-data-access-auth';

interface SimpleBill {
  id: string;
  number: string;
  title: string;
}

@Component({
  selector: 'lib-bill-remove',
  imports: [
    SlicePipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './bill-remove.component.html',
  styleUrl: './bill-remove.component.scss',
})
export class RemoveBill {
  private app = inject(FirebaseApp);
  protected auth = inject(AuthService);
  private legislature = inject(LegislatureService);
  private legislation = inject(LegislationService);
  private snackBar = inject(MatSnackBar);

  selectedState = signal<string>('');
  selectedBillId = signal<string>('');

  availableBills = signal<SimpleBill[]>([]);
  isLoadingBills = signal(false);
  isDeleting = signal(false);

  states = this.legislature.supportedLegislatures();

  /**
   * Effect: Automatically fetches bills when the selectedState changes.
   */
  constructor() {
    effect(() => {
      const state = this.selectedState();
      if (state) {
        this.fetchBillsForState(state);
      } else {
        this.availableBills.set([]);
      }
    });
  }

  async fetchBillsForState(state: string) {
    this.isLoadingBills.set(true);
    this.selectedBillId.set(''); // Reset selected bill

    try {
      const { getFirestore, collection, query, orderBy, getDocs } =
        await import('@angular/fire/firestore');

      const firestore = getFirestore(this.app);

      // Path: legislatures/{state}/legislation
      const billsRef = collection(
        firestore,
        `legislatures/${state}/legislation`,
      );
      const q = query(billsRef, orderBy('id')); // Sort alphabetically by bill number

      const snapshot = await getDocs(q);

      const bills = snapshot.docs.map((doc) => ({
        id: doc.id,
        number: doc.data()['id'] || 'Unknown',
        title: doc.data()['title'] || 'No Title',
      })) as SimpleBill[];

      this.availableBills.set(bills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      this.snackBar.open('Could not load bills for this state.', 'Close');
    } finally {
      this.isLoadingBills.set(false);
    }
  }

  async onDelete() {
    const state = this.selectedState();
    const billId = this.selectedBillId();

    if (!state || !billId) return;

    // Confirm Intent
    if (
      !confirm(
        `ARE YOU SURE?\n\nThis will permanently delete bill ${billId} from the database.`,
      )
    ) {
      return;
    }

    this.isDeleting.set(true);

    try {
      // Call the Cloud Function via AuthService
      await this.legislation.removeBill(state, billId);

      this.snackBar.open('Bill deleted successfully.', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      // Refresh list
      this.fetchBillsForState(state);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        this.snackBar.open(error.message || 'Deletion failed.', 'Close', {
          panelClass: ['error-snackbar'],
        });
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      this.isDeleting.set(false);
    }
  }
}
