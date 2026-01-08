import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

import { Admin } from './admin';
import { ConfigService } from '@app-core/services/config.service';
import { RuntimeConfig } from '@app-models/runtime-config';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  // 1. Updated Mock Data with Resources
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
        title: 'Mock Resource',
        url: 'http://mock.com',
        description: '',
        icon: 'link',
        actionLabel: 'Go',
      },
    ],
  };

  const mockConfigService = {
    config: signal(mockConfigData),
    save: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [provideNoopAnimations(), { provide: ConfigService, useValue: mockConfigService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with config data including resources', () => {
    // Check main form
    const formValue = component.form.getRawValue();
    expect(formValue.organization.name).toBe('Test Org');

    // Check Array Population
    expect(component.resourcesArray.length).toBe(1);
    expect(component.resourcesArray.at(0).value.title).toBe('Mock Resource');
  });

  it('should add a new resource', () => {
    const initialLen = component.resourcesArray.length;
    component.addResource();

    expect(component.resourcesArray.length).toBe(initialLen + 1);
    expect(component.resourcesArray.at(initialLen).value.title).toBe(''); // Empty default
  });

  it('should remove a resource', () => {
    // We start with 1 from mock
    expect(component.resourcesArray.length).toBe(1);

    component.removeResource(0);

    expect(component.resourcesArray.length).toBe(0);
    expect(component.form.dirty).toBe(true);
  });

  it('should save full configuration including resources', async () => {
    // Modify the existing resource
    component.resourcesArray.at(0).patchValue({ title: 'Updated Title' });

    await component.saveConfig();

    expect(mockConfigService.save).toHaveBeenCalled();
    const capturedArgs = mockConfigService.save.mock.calls[0][0];

    // Assert structure matches RuntimeConfig
    expect(capturedArgs.resources[0].title).toBe('Updated Title');
    expect(capturedArgs.organization.name).toBe('Test Org');
  });
});
