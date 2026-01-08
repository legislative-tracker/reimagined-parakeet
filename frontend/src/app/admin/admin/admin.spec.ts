import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

// Imports
import { Admin } from './admin';
import { ConfigService } from '@app-core/services/config.service';
import { RuntimeConfig } from '@app-models/runtime-config';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  // 1. Create a Mock Data Object
  const mockConfigData: RuntimeConfig = {
    organization: { name: 'Test Org', url: 'http://test.com' },
    branding: {
      primaryColor: '#000000',
      logoUrl: 'logo.png',
      faviconUrl: 'favicon.ico',
      darkMode: false,
    },
  };

  // 2. Create the Mock Service
  // It must match the public API of ConfigService that Admin uses
  const mockConfigService = {
    // The component reads this signal to patch the form
    config: signal(mockConfigData),
    // The component calls this to save
    save: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [
        provideNoopAnimations(),
        // 3. DI Override: When Admin asks for ConfigService, give it the mock
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit and Effects
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with config data', () => {
    // Verify the effect() worked and patched the form
    const formValue = component.form.getRawValue();
    expect(formValue.organization.name).toBe('Test Org');
    expect(formValue.branding.primaryColor).toBe('#000000');
  });

  it('should call save() on submission', async () => {
    // Update form
    component.form.patchValue({
      organization: { name: 'New Name' },
    });

    // Trigger save
    await component.saveConfig();

    // Verify mock was called
    expect(mockConfigService.save).toHaveBeenCalled();
    const capturedArgs = mockConfigService.save.mock.calls[0][0];
    expect(capturedArgs.organization.name).toBe('New Name');
  });
});
