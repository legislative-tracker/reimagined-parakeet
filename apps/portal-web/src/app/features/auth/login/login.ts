import { Component, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  authError = signal<string | null>(null);

  async loginWithGoogle() {
    this.authError.set(null);

    try {
      const result = await this.authService.loginWithGoogle();

      if (result) {
        this.router.navigate(['/profile']);
      } else {
        this.authError.set('Unable to authenticate with Google. Please try again.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Auth Error Message:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  }
}
