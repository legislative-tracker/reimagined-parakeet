import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth-service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-admin.html',
  styleUrl: './add-admin.scss',
})
export class AddAdmin {
  private auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  email = signal('');
  isLoading = signal(false);

  async promoteUser() {
    if (!this.email()) return;

    this.isLoading.set(true);

    try {
      // Call the function we added to AuthService
      await this.auth.grantAdminPrivileges(this.email());

      this.snackBar.open(`Success! ${this.email()} is now an Admin.`, 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar'],
      });

      this.email.set(''); // Clear the form
    } catch (error: any) {
      console.error(error);
      this.snackBar.open(error.message || 'Promotion failed.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
