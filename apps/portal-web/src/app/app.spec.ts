import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal, Signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

import { App } from './app.js';
import { ConfigService } from './core/services/config.service.js';
import { RuntimeConfig } from './core/models/runtime-config.js';

/**
 * @description Unit tests for the root App component.
 * Verifies correct initialization and dependency injection of the global configuration.
 */
describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  /**
   * Mock implementation of ConfigService.
   * Uses a Signal to match the production service's reactive pattern.
   */
  const mockConfigService = {
    config: signal({
      branding: {
        logoUrl: 'assets/mock-logo.png',
        primaryColor: '#000000',
        faviconUrl: 'favicon.ico',
      },
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        // Required for components containing <router-outlet />
        provideRouter([]),
        // Inject the mock configuration service
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description Verifies that the component correctly initializes its local
   * configuration reference from the injected ConfigService.
   */
  it('should initialize config property from ConfigService', () => {
    /** * Resolved 'no-explicit-any': Cast the component to a type that includes
     * the config signal. This allows access to the property for testing
     * while maintaining strict type safety.
     */
    const appWithConfig = component as unknown as { config: Signal<RuntimeConfig> };
    const appConfig = appWithConfig.config;

    expect(appConfig).toBeDefined();
    expect(appConfig().branding.logoUrl).toBe('assets/mock-logo.png');
  });
});
