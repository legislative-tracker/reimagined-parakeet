import { Component, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/core/auth-service';
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
    const result = await this.authService.loginWithGoogle();

    if (result) {
      // Navigate to the dashboard or previously requested route
      this.router.navigate(['/profile']);
    } else {
      this.authError.set('Unable to authenticate with Google. Please try again.');
    }
  }
}
