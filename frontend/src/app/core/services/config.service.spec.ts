import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { FirebaseApp } from '@angular/fire/app';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { ConfigService } from './config.service';

// -------------------------------------------------------------------------
// Mock Dynamic Imports
// -------------------------------------------------------------------------

// --- Firestore Mocks ---
const mockDocData = vi.fn();
const mockDoc = vi.fn();
const mockGetFirestore = vi.fn().mockReturnValue({}); // Default for initial load

vi.mock('@angular/fire/firestore', () => ({
  getFirestore: (...args: any[]) => mockGetFirestore(...args),
  doc: (...args: any[]) => mockDoc(...args),
  docData: (...args: any[]) => mockDocData(...args),
}));

// --- Material Color Utilities Mocks ---
const mockArgbFromHex = vi.fn();
const mockThemeFromSourceColor = vi.fn();
const mockHexFromArgb = vi.fn();

vi.mock('@material/material-color-utilities', () => ({
  argbFromHex: (...args: any[]) => mockArgbFromHex(...args),
  themeFromSourceColor: (...args: any[]) => mockThemeFromSourceColor(...args),
  hexFromArgb: (...args: any[]) => mockHexFromArgb(...args),
}));

describe('ConfigService', () => {
  let service: ConfigService;
  let documentMock: Document;

  const mockFirebaseApp = { name: '[DEFAULT]' };

  beforeEach(() => {
    // ⚠️ RESET MOCKS: This wipes out previous .mockReturnValue calls!
    vi.resetAllMocks();

    //: Restore default return values immediately after reset
    mockGetFirestore.mockReturnValue({}); // Ensures firestore instance is not undefined
    mockThemeFromSourceColor.mockReturnValue({ schemes: { light: { toJSON: () => ({}) } } });
    mockArgbFromHex.mockReturnValue(0);
    mockHexFromArgb.mockReturnValue('#000000');

    // Mock Document
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
    it('should fetch remote config and update signal', async () => {
      const remoteConfig = {
        branding: {
          logoUrl: 'assets/custom-logo.png',
          primaryColor: '#ff0000',
        },
      };
      mockDocData.mockReturnValue(of(remoteConfig));

      await service.load();

      expect(mockGetFirestore).toHaveBeenCalledWith(mockFirebaseApp);
      // Now mockGetFirestore returns {}, so expect.anything() will pass
      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'configurations/global');

      const updated = service.config();
      expect(updated.branding.logoUrl).toBe('assets/custom-logo.png');
      expect(updated.branding.primaryColor).toBe('#ff0000');
    });

    it('should use defaults if Firestore fails', async () => {
      mockDocData.mockReturnValue(throwError(() => new Error('Permission Denied')));
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await service.load();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Config fetch failed, using defaults.',
        expect.anything()
      );

      const current = service.config();
      expect(current.branding.primaryColor).toBe('#673ab7');
    });
  });

  describe('Effects (Favicon & Theme)', () => {
    it('should update favicon when config changes', async () => {
      const mockLink = document.createElement('link');
      vi.spyOn(documentMock, 'querySelector').mockReturnValue(mockLink);

      const newConfig = {
        branding: { logoUrl: '', primaryColor: '', faviconUrl: 'new-icon.ico' },
      };

      mockDocData.mockReturnValue(of(newConfig));
      await service.load();
      await TestBed.flushEffects();

      expect(mockLink.href).toContain('new-icon.ico');
    });

    it('should apply dynamic theme when primary color changes', async () => {
      // Setup Specific Mocks for this test
      mockArgbFromHex.mockReturnValue(12345);
      const mockTheme = { schemes: { light: { toJSON: () => ({ primary: 0xff0000 }) } } };
      mockThemeFromSourceColor.mockReturnValue(mockTheme);
      mockHexFromArgb.mockReturnValue('#ff0000');

      const newConfig = {
        branding: { logoUrl: '', primaryColor: '#ff0000', faviconUrl: '' },
      };
      mockDocData.mockReturnValue(of(newConfig));

      await service.load();
      await TestBed.flushEffects();

      // Wait for async import inside effect
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockArgbFromHex).toHaveBeenCalledWith('#ff0000');

      expect(documentMock.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--mat-sys-color-primary',
        '#ff0000'
      );
    });

    it('should create new favicon element if none exists', async () => {
      vi.spyOn(documentMock, 'querySelector').mockReturnValue(null);
      const mockLink = document.createElement('link');
      vi.spyOn(documentMock, 'createElement').mockReturnValue(mockLink);

      const newConfig = { branding: { logoUrl: '', primaryColor: '', faviconUrl: 'created.ico' } };
      mockDocData.mockReturnValue(of(newConfig));

      await service.load();
      await TestBed.flushEffects();

      expect(documentMock.head.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.href).toContain('created.ico');
    });
  });
});
