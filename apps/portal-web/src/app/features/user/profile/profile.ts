import { Component, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

// App imports
import { AuthService } from '../../../core/services/auth.service.js';
import { AddressForm } from '../../../shared/address-form/address-form.component.js';
import { TableComponent } from '../../../shared/table/table.component.js';
import { LEGISLATOR_COLS } from '../../../models/column-config.js';
import { SearchAddress } from '../../../models/address.js';

/**
 * Component representing the user profile page.
 * @description Manages user information display and coordinates with Firebase Functions
 * to retrieve local representatives based on address searches.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    DatePipe,
    MatListModule,
    MatIconModule,
    AddressForm,
    MatTabsModule,
    TableComponent,
    MatSnackBarModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  /** Reference to the Authentication service. */
  private readonly auth = inject(AuthService);
  /** Reference to the Firebase App instance. */
  private readonly app = inject(FirebaseApp);
  /** Service for displaying snack-bar notifications. */
  private readonly snackBar = inject(MatSnackBar);

  /** Signal representing the current user's profile data. */
  public readonly user = this.auth.userProfile;
  /** Column configuration for the legislative data table. */
  public readonly legislatorCols = LEGISLATOR_COLS;

  /**
   * Processes a search address to fetch corresponding legislative representatives.
   * @param e - The structured search address emitted by the AddressForm.
   * @returns A promise that resolves when the network request completes.
   */
  public searchAddress = async (e: SearchAddress): Promise<void> => {
    let addressStr = e.address;
    if (e.address2) addressStr += `, ${e.address2}`;
    addressStr += `, ${e.city}, ${e.state} ${e.postalCode}`;

    try {
      const { getFunctions, httpsCallable } = await import('@angular/fire/functions');

      const functions = getFunctions(this.app);
      const fetchUserReps = httpsCallable(functions, 'users-fetchUserReps');

      const result = await fetchUserReps({ address: addressStr });

      console.log('Successfully retrieved representatives:', result.data);

      this.snackBar.open('Representatives updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error during fetch';
      console.error('Fetch representatives failed:', message);

      this.snackBar.open(`Error: ${message}`, 'Darn', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    }
  };
}
