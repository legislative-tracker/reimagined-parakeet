import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ImplementedStatePairs } from '../../../core/app-config/implemented-states.js';
import { LegislationService } from '@legislative-tracker/portal-web-data-access-legislature';

@Component({
  selector: 'lib-bill-add',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-bill.html',
  styleUrl: './add-bill.scss',
})
export class AddBill {
  private legislation = inject(LegislationService);
  private snackBar = inject(MatSnackBar);

  // Form State
  isLoading = signal(false);

  // Data Model
  state = '';
  billId = '';
  implementedStates = ImplementedStatePairs;

  async onSubmit() {
    if (!this.billId || !this.billId) return;

    this.isLoading.set(true);

    // Construct the bill object to match what Firestore expects
    const newBill = {
      id: this.billId,
      updatedAt: new Date().toISOString(),
    };

    try {
      // Call the service method we created earlier
      await this.legislation.addBill(this.state, newBill);

      this.snackBar.open(`Success! Bill ${this.billId} added.`, 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      this.resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        this.snackBar.open(error.message || 'Failed to add bill.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  resetForm() {
    this.state = '';
    this.billId = '';
  }
}
