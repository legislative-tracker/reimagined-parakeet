import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Material Imports
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

// App imports
import { RuntimeConfig } from '@app-models/runtime-config'; // Updated import
import { ConfigService } from '@app-core/services/config.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule, // Used for darkMode
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private fb = inject(FormBuilder);
  private configService = inject(ConfigService);
  private snackBar = inject(MatSnackBar);

  readonly panelOpenState = signal(false);
  readonly isSaving = signal(false);

  // Strictly typed form matching RuntimeConfig
  form = this.fb.group({
    organization: this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required], // You might add a URL validator regex here
    }),
    branding: this.fb.group({
      primaryColor: ['#673ab7', [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)]],
      logoUrl: ['', Validators.required],
      faviconUrl: ['favicon.ico'],
      darkMode: [false],
    }),
  });

  constructor() {
    // SYNC: Service -> Form
    effect(() => {
      const currentConfig = this.configService.config();
      // 'emitEvent: false' prevents infinite loops
      if (currentConfig) {
        this.form.patchValue(currentConfig, { emitEvent: false });
      }
    });
  }

  async saveConfig() {
    if (this.form.invalid) {
      this.snackBar.open('Please check the form for errors.', 'Close', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.form.getRawValue() as RuntimeConfig;

    try {
      await this.configService.save(formValue);
      this.snackBar.open('Configuration saved successfully', 'Close', { duration: 3000 });
    } catch (err) {
      console.error(err);
      this.snackBar.open('Error saving configuration', 'Close', {
        duration: 5000,
        panelClass: 'error-snack',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  resetForm() {
    this.form.patchValue(this.configService.config());
  }
}
