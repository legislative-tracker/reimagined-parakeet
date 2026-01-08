import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

import { Admin } from './admin';
import { ConfigService } from '@app-core/services/config.service';
import { RuntimeConfig } from '@app-models/runtime-config';

import { CdkDragDrop } from '@angular/cdk/drag-drop';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

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
    const resources = component.resourcesArray;
    expect(resources.length).toBe(2);
    expect(resources.at(0).value.title).toBe('Resource A');
    expect(resources.at(1).value.title).toBe('Resource B');
  });

  it('should add a new resource', () => {
    const initialLen = component.resourcesArray.length;
    component.addResource();
    expect(component.resourcesArray.length).toBe(initialLen + 1);
  });

  it('should remove a resource', () => {
    component.removeResource(0);
    expect(component.resourcesArray.length).toBe(1);
    expect(component.resourcesArray.at(0).value.title).toBe('Resource B');
    expect(component.form.dirty).toBe(true);
  });

  it('should reorder resources on drop', () => {
    expect(component.resourcesArray.at(0).value.title).toBe('Resource A');
    expect(component.resourcesArray.at(1).value.title).toBe('Resource B');

    const mockDropEvent = {
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<any[]>;

    component.drop(mockDropEvent);

    expect(component.resourcesArray.at(0).value.title).toBe('Resource B');
    expect(component.resourcesArray.at(1).value.title).toBe('Resource A');

    expect(component.form.dirty).toBe(true);
  });

  it('should save full configuration including new order', async () => {
    const mockDropEvent = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<any[]>;
    component.drop(mockDropEvent);

    await component.saveConfig();

    expect(mockConfigService.save).toHaveBeenCalled();
    const capturedArgs = mockConfigService.save.mock.calls[0][0];

    expect(capturedArgs.resources[0].title).toBe('Resource B');
    expect(capturedArgs.resources[1].title).toBe('Resource A');
  });
});
