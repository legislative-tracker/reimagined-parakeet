import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { FirebaseApp } from '@angular/fire/app';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { ConfigService } from './config.service.js';
import { RuntimeConfig } from '../../models/runtime-config.js';

// -------------------------------------------------------------------------
// Mock Dynamic Imports
// -------------------------------------------------------------------------

// --- Firestore Mocks ---
const mockDocData = vi.fn();
const mockDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockGetFirestore = vi.fn().mockReturnValue({});

/**
 * Mocks the Firebase Firestore module using unknown parameters to satisfy linting.
 */
vi.mock('@angular/fire/firestore', () => ({
  getFirestore: (...args: unknown[]) => mockGetFirestore(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  docData: (...args: unknown[]) => mockDocData(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

// --- Material Color Utilities Mocks ---
const mockArgbFromHex = vi.fn();
const mockThemeFromSourceColor = vi.fn();
const mockHexFromArgb = vi.fn();

/**
 * Mocks Material Color Utilities using unknown parameters to satisfy linting.
 */
vi.mock('@material/material-color-utilities', () => ({
  argbFromHex: (...args: unknown[]) => mockArgbFromHex(...args),
  themeFromSourceColor: (...args: unknown[]) => mockThemeFromSourceColor(...args),
  hexFromArgb: (...args: unknown[]) => mockHexFromArgb(...args),
}));

/**
 * @description Unit tests for ConfigService, verifying dynamic branding and persistence.
 */
describe('ConfigService', () => {
  let service: ConfigService;
  let documentMock: Document;

  const mockFirebaseApp = { name: '[DEFAULT]' };

  beforeEach(() => {
    vi.resetAllMocks();

    mockGetFirestore.mockReturnValue({});
    mockDoc.mockReturnValue({ path: 'configurations/global' });
    mockSetDoc.mockResolvedValue(void 0);

    // Setup default Material Scheme mock structure
    mockThemeFromSourceColor.mockReturnValue({
      schemes: {
        light: { toJSON: () => ({}) },
      },
    });
    mockArgbFromHex.mockReturnValue(0);
    mockHexFromArgb.mockReturnValue('#000000');

    documentMock = document;
    vi.spyOn(documentMock, 'querySelector');
    vi.spyOn(documentMock, 'createElement');
    vi.spyOn(documentMock.head, 'appendChild');
    vi.spyOn(documentMock.documentElement.style, 'setProperty');

    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: FirebaseApp, useValue: mockFirebaseApp },
        { provide: DOCUMENT, useValue: documentMock },
      ],
    });

    service = TestBed.inject(ConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created with default configuration', () => {
    expect(service).toBeTruthy();
    const current = service.config();
    expect(current.branding.primaryColor).toBe('#673ab7');
  });

  describe('load()', () => {
    /**
     * @description Verifies that remote configuration is merged correctly with local defaults.
     */
    it('should fetch remote config and merge both organization and branding', async () => {
      const remoteConfig = {
        organization: { name: 'Test Org', url: 'https://test.com' },
        branding: { primaryColor: '#ff0000' },
      };
      mockDocData.mockReturnValue(of(remoteConfig));

      await service.load();

      expect(mockGetFirestore).toHaveBeenCalledWith(mockFirebaseApp);
      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'configurations/global');

      const updated = service.config();
      expect(updated.organization.name).toBe('Test Org');
      expect(updated.branding.primaryColor).toBe('#ff0000');
      // Verify deep merge logic preserves defaults
      expect(updated.branding.logoUrl).toContain('assets/default-logo.png');
    });

    it('should use defaults if Firestore fails', async () => {
      mockDocData.mockReturnValue(throwError(() => new Error('Permission Denied')));
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await service.load();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Config fetch failed, using defaults.',
        expect.anything(),
      );

      const current = service.config();
      expect(current.branding.primaryColor).toBe('#673ab7');
    });
  });

  describe('save()', () => {
    /**
     * @description Ensures the save method updates both Firestore and the internal state Signal.
     */
    it('should save to Firestore and update signal optimistically', async () => {
      const newConfig: Partial<RuntimeConfig> = {
        organization: { name: 'Updated Org', url: 'http://update.com' },
      };

      // Resolved 'no-explicit-any' by using proper type assertion
      await service.save(newConfig);

      expect(mockSetDoc).toHaveBeenCalledWith(expect.anything(), newConfig, { merge: true });

      const current = service.config();
      expect(current.organization.name).toBe('Updated Org');
    });

    it('should throw error if Firestore save fails', async () => {
      mockSetDoc.mockRejectedValue(new Error('Write Failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const newConfig: Partial<RuntimeConfig> = {
        branding: { primaryColor: '#000000', faviconUrl: '', logoUrl: '' },
      };

      await expect(service.save(newConfig)).rejects.toThrow('Write Failed');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Effects (Favicon & Theme)', () => {
    it('should update favicon when config changes', async () => {
      const mockLink = document.createElement('link') as HTMLLinkElement;
      vi.spyOn(documentMock, 'querySelector').mockReturnValue(mockLink);

      const newConfig = {
        branding: { faviconUrl: 'new-icon.ico' },
      };

      mockDocData.mockReturnValue(of(newConfig));
      await service.load();
      await TestBed.flushEffects();

      expect(mockLink.href).toContain('new-icon.ico');
    });

    /**
     * @description Tests the reactive effect that applies Material design tokens to CSS variables.
     */
    it('should apply dynamic theme when primary color changes', async () => {
      mockArgbFromHex.mockReturnValue(12345);
      const mockTheme = { schemes: { light: { toJSON: () => ({ primary: 0xff0000 }) } } };
      mockThemeFromSourceColor.mockReturnValue(mockTheme);
      mockHexFromArgb.mockReturnValue('#ff0000');

      const newConfig = {
        branding: { primaryColor: '#ff0000' },
      };
      mockDocData.mockReturnValue(of(newConfig));

      await service.load();
      await TestBed.flushEffects();

      // Flush microtasks for the async dynamic import within applyAngularMaterialTheme
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockArgbFromHex).toHaveBeenCalledWith('#ff0000');
      expect(documentMock.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--mat-sys-color-primary',
        '#ff0000',
      );
    });
  });
});
