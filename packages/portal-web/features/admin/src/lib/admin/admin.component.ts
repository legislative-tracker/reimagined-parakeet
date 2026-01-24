import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormArray,
  type FormGroup,
} from '@angular/forms';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import type {
  RuntimeConfig,
  ResourceLink,
} from '@legislative-tracker/shared-data-models';
import { ConfigService } from '@legislative-tracker/portal-web-data-access-config';

/**
 * Administrative component for managing application-wide configuration.
 * @description Provides a form-based interface to manage organization details, branding,
 * and dynamic resources with drag-and-drop support.
 */
@Component({
  selector: 'lib-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
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
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class Admin {
  /** FormBuilder service for reactive form construction. */
  private readonly fb = inject(FormBuilder);
  /** Service for retrieving and persisting application configuration. */
  private readonly configService = inject(ConfigService);
  /** Material SnackBar for user feedback. */
  private readonly snackBar = inject(MatSnackBar);

  /** Reactive state for the expansion panel. */
  public readonly panelOpenState = signal(false);
  /** Indicates if a save operation is currently in progress. */
  public readonly isSaving = signal(false);

  /** Root form group for the configuration settings. */
  public readonly form = this.fb.group({
    organization: this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
    }),
    branding: this.fb.group({
      primaryColor: [
        '#673ab7',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
      logoUrl: ['', Validators.required],
      faviconUrl: ['favicon.ico'],
      darkMode: [false],
    }),
    resources: this.fb.array<FormGroup>([]),
  });

  /**
   * Helper to access the resources FormArray with correct typing.
   * @returns The FormArray containing resource FormGroups.
   */
  get resourcesArray(): FormArray {
    return this.form.get('resources') as FormArray;
  }

  constructor() {
    /**
     * Synchronizes the form state with the global configuration signal.
     */
    effect(() => {
      const config = this.configService.config();
      if (config) {
        this.form.patchValue(
          {
            organization: config.organization,
            branding: config.branding,
          },
          { emitEvent: false },
        );

        this.resourcesArray.clear({ emitEvent: false });
        const resources = config.resources || [];
        resources.forEach((res) => {
          this.resourcesArray.push(this.createResourceGroup(res), {
            emitEvent: false,
          });
        });
      }
    });
  }

  /**
   * Creates a typed FormGroup for a resource link.
   * @param data - Optional initial data for the resource.
   * @returns A FormGroup representing a ResourceLink.
   */
  private createResourceGroup(data?: ResourceLink): FormGroup {
    return this.fb.group({
      title: [data?.title || '', Validators.required],
      url: [data?.url || '', Validators.required],
      description: [data?.description || ''],
      icon: [data?.icon || 'link'],
      actionLabel: [data?.actionLabel || 'Open'],
    });
  }

  /**
   * Adds a new empty resource to the list.
   */
  public addResource(): void {
    this.resourcesArray.push(this.createResourceGroup());
    this.form.markAsDirty();
  }

  /**
   * Removes a resource at the specified index.
   * @param index - The index of the resource to remove.
   */
  public removeResource(index: number): void {
    this.resourcesArray.removeAt(index);
    this.form.markAsDirty();
  }

  /**
   * Handles the reordering of resources via drag-and-drop.
   * @param event - The CDK drag-drop event containing movement indices.
   * @description Resolved 'no-explicit-any' by using ResourceLink[] type.
   */
  public drop(event: CdkDragDrop<ResourceLink[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const movedControl = this.resourcesArray.at(event.previousIndex);

    this.resourcesArray.removeAt(event.previousIndex);
    this.resourcesArray.insert(event.currentIndex, movedControl);

    this.form.markAsDirty();
  }

  /**
   * Persists the current form configuration to the backend.
   */
  public async saveConfig(): Promise<void> {
    if (this.form.invalid) {
      this.snackBar.open('Please check the form for errors.', 'Close', {
        duration: 3000,
      });
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.form.getRawValue() as RuntimeConfig;

    try {
      await this.configService.save(formValue);
      this.snackBar.open('Configuration saved successfully', 'Close', {
        duration: 3000,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.snackBar.open(`Error saving configuration: ${message}`, 'Close', {
        duration: 5000,
        panelClass: 'error-snack',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Resets the form to the current global configuration state.
   */
  public resetForm(): void {
    const config = this.configService.config();
    this.form.patchValue(config);
    this.resourcesArray.clear();
    (config.resources || []).forEach((res) =>
      this.resourcesArray.push(this.createResourceGroup(res)),
    );
  }
}
