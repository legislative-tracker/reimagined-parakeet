import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserManagementService } from '@legislative-tracker/portal-web-data-access-auth';

@Component({
  selector: 'lib-admin-add',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-add.component.html',
  styleUrl: './admin-add.component.scss',
})
export class AdminAddComponent {
  private userMgmt = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);

  email = signal('');
  isLoading = signal(false);

  async promoteUser() {
    if (!this.email()) return;

    this.isLoading.set(true);

    try {
      // Call the function we added to AuthService
      await this.userMgmt.grantAdminPrivileges(this.email());

      this.snackBar.open(`Success! ${this.email()} is now an Admin.`, 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar'],
      });

      this.email.set(''); // Clear the form
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message); // This is now safe!
        this.snackBar.open(error.message || 'Promotion failed.', 'Close', {
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
}
