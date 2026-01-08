import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';

// Material Imports
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card'; // <--- Required for UI cards
import { MatTooltipModule } from '@angular/material/tooltip';

// App imports
import { RuntimeConfig, ResourceLink } from '@app-models/runtime-config';
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
    MatSlideToggleModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
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

  form = this.fb.group({
    organization: this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
    }),
    branding: this.fb.group({
      primaryColor: ['#673ab7', [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)]],
      logoUrl: ['', Validators.required],
      faviconUrl: ['favicon.ico'],
      darkMode: [false],
    }),
    // NEW: Dynamic Array
    resources: this.fb.array([]),
  });

  // Helper Getter
  get resourcesArray() {
    return this.form.get('resources') as FormArray;
  }

  constructor() {
    // SYNC: Service -> Form
    effect(() => {
      const config = this.configService.config();
      if (config) {
        // 1. Patch static groups
        this.form.patchValue(
          {
            organization: config.organization,
            branding: config.branding,
          },
          { emitEvent: false }
        );

        // 2. Handle FormArray (Must clear and rebuild)
        this.resourcesArray.clear({ emitEvent: false });

        const resources = config.resources || [];
        resources.forEach((res) => {
          this.resourcesArray.push(this.createResourceGroup(res), { emitEvent: false });
        });
      }
    });
  }

  // Create a row with defaults
  private createResourceGroup(data?: ResourceLink): FormGroup {
    return this.fb.group({
      title: [data?.title || '', Validators.required],
      url: [data?.url || '', Validators.required],
      description: [data?.description || ''],
      icon: [data?.icon || 'link'],
      actionLabel: [data?.actionLabel || 'Open'],
    });
  }

  // Actions
  addResource() {
    this.resourcesArray.push(this.createResourceGroup());
    this.form.markAsDirty();
  }

  removeResource(index: number) {
    this.resourcesArray.removeAt(index);
    this.form.markAsDirty();
  }

  async saveConfig() {
    if (this.form.invalid) {
      this.snackBar.open('Please check the form for errors.', 'Close', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    // getRawValue() includes the array data correctly
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
    // Re-trigger the effect logic manually or just let the signal update handle it
    const config = this.configService.config();
    this.form.patchValue(config);

    this.resourcesArray.clear();
    (config.resources || []).forEach((res) =>
      this.resourcesArray.push(this.createResourceGroup(res))
    );
  }
}
