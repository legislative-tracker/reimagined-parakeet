import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { signal } from '@angular/core';

import { Admin } from './admin.js';
import { ConfigService } from '../../core/services/config.service.js';
import { RuntimeConfig, ResourceLink } from '../../models/runtime-config.js';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CdkDragDrop } from '@angular/cdk/drag-drop';

/**
 * @description Unit tests for the Admin component.
 * Verifies form initialization, dynamic resource management,
 * and persistence logic using Vitest mocks.
 */
describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  /** * Resolved 'no-explicit-any': Explicitly typing spies as a partial of
   * the real service with Mock functions.
   */
  let configServiceSpy: { config: ReturnType<typeof signal>; save: Mock };
  let snackBarSpy: { open: Mock };

  const mockConfigData: RuntimeConfig = {
    organization: { name: 'Test Org', url: 'http://test.com' },
    branding: {
      primaryColor: '#000000',
      logoUrl: 'logo.png',
      faviconUrl: 'favicon.ico',
      darkMode: false,
    },
    resources: [
      {
        title: 'Resource A',
        url: 'http://a.com',
        description: '',
        icon: 'link',
        actionLabel: 'Go',
      },
      {
        title: 'Resource B',
        url: 'http://b.com',
        description: '',
        icon: 'link',
        actionLabel: 'Go',
      },
    ],
  };

  beforeEach(async () => {
    // 1. Define Mocks
    const mockConfigService = {
      config: signal({ ...mockConfigData }),
      save: vi.fn().mockResolvedValue(undefined),
    };

    const mockSnackBar = {
      open: vi.fn(),
    };

    // 2. Configure TestBed
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [
        provideNoopAnimations(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    // 3. Create Component & Inject Spies
    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;

    // Retrieve the mocks from TestBed cast to our defined interface
    configServiceSpy = TestBed.inject(ConfigService) as unknown as typeof configServiceSpy;
    snackBarSpy = TestBed.inject(MatSnackBar) as unknown as typeof snackBarSpy;

    /** * * Resolved 'no-explicit-any': Using unknown casting to safely
     * access internal property for test initialization.
     */
    (component as unknown as { snackBar: typeof snackBarSpy }).snackBar = snackBarSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with config data via effect', () => {
    const resources = component.resourcesArray;
    expect(component.form.get('organization.name')?.value).toBe('Test Org');
    expect(resources.length).toBe(2);
    expect(resources.at(0).value.title).toBe('Resource A');
  });

  it('should add a new resource', () => {
    const initialLen = component.resourcesArray.length;
    component.addResource();
    expect(component.resourcesArray.length).toBe(initialLen + 1);
    expect(component.form.dirty).toBe(true);
  });

  it('should remove a resource', () => {
    component.removeResource(0);
    expect(component.resourcesArray.length).toBe(1);
    expect(component.form.dirty).toBe(true);
  });

  it('should reorder resources on drop', () => {
    /** * * Resolved 'no-explicit-any': Typed the mock event to match
     * the ResourceLink[] expected by the refactored component.
     */
    const mockDropEvent = {
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<ResourceLink[]>;

    component.drop(mockDropEvent);

    expect(component.resourcesArray.at(0).value.title).toBe('Resource B');
    expect(component.resourcesArray.at(1).value.title).toBe('Resource A');
    expect(component.form.dirty).toBe(true);
  });

  it('should save full configuration', async () => {
    component.form.patchValue({
      organization: { name: 'Updated Org', url: 'http://valid.com' },
      branding: { primaryColor: '#ffffff', logoUrl: 'assets/logo.png' },
    });

    await component.saveConfig();

    expect(component.isSaving()).toBe(false);
    expect(configServiceSpy.save).toHaveBeenCalled();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      expect.stringContaining('saved successfully'),
      expect.any(String),
      expect.any(Object),
    );

    const capturedArgs = configServiceSpy.save.mock.calls[0][0] as RuntimeConfig;
    expect(capturedArgs.organization.name).toBe('Updated Org');
  });

  it('should handle save errors gracefully', async () => {
    component.form.patchValue({
      organization: { name: 'Valid Org', url: 'http://valid.com' },
      branding: { primaryColor: '#ffffff', logoUrl: 'assets/logo.png' },
    });

    configServiceSpy.save.mockRejectedValueOnce(new Error('Save failed'));

    await component.saveConfig();

    expect(component.isSaving()).toBe(false);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      expect.stringContaining('Error saving'),
      'Close',
      expect.objectContaining({ panelClass: 'error-snack' }),
    );
  });

  it('should reset form to original config', () => {
    component.removeResource(0);
    component.form.patchValue({ organization: { name: 'Changed Name' } });

    component.resetForm();

    expect(component.form.get('organization.name')?.value).toBe('Test Org');
    expect(component.resourcesArray.length).toBe(2);
  });
});
