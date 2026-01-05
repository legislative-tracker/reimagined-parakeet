import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ConfigService, RuntimeConfig } from './config-service';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { BehaviorSubject, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock Firestore methods
vi.mock('@angular/fire/firestore', async (importOriginal) => {
  // We can import the original module dynamically
  const actual = await importOriginal<typeof import('@angular/fire/firestore')>();

  return {
    ...actual,
    // Just create the spy function here.
    // Do NOT set complex return values (like observables) here.
    doc: vi.fn(),
    docData: vi.fn(),
  };
});

describe('ConfigService', () => {
  let service: ConfigService;
  let docDataSubject: BehaviorSubject<any>;
  let documentMock: Document;

  beforeEach(() => {
    // Setup the reactive stream for Firestore data
    docDataSubject = new BehaviorSubject<any>(null);

    // Default mocks
    (doc as any).mockReturnValue('mock-doc-ref');
    (docData as any).mockReturnValue(docDataSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        // Provide a dummy Firestore object
        { provide: Firestore, useValue: {} },
        // DOCUMENT is provided automatically by the test environment (JSDOM)
      ],
    });

    service = TestBed.inject(ConfigService);
    documentMock = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created with default config', () => {
    const defaults = service.config();
    expect(defaults.branding.primaryColor).toBe('#673ab7'); // The default purple
  });

  describe('load()', () => {
    it('should fetch config and update the signal', async () => {
      const mockConfig: RuntimeConfig = {
        branding: {
          logoUrl: 'custom-logo.png',
          primaryColor: '#ff0000',
          faviconUrl: 'custom.ico',
        },
      };

      // Emit the mock config immediately so firstValueFrom resolves
      docDataSubject.next(mockConfig);

      await service.load();

      const current = service.config();
      expect(current.branding.primaryColor).toBe('#ff0000');
      expect(current.branding.logoUrl).toBe('custom-logo.png');
    });

    it('should use defaults if the fetch fails', async () => {
      // Simulate an error in the stream
      (docData as any).mockReturnValue(throwError(() => new Error('Firestore offline')));

      await service.load();

      // Should still match default config
      expect(service.config().branding.primaryColor).toBe('#673ab7');
    });
  });

  describe('Effects (DOM Updates)', () => {
    it('should update CSS variables and Favicon when signal changes', () => {
      // Spy on the Document to verify side effects
      // We spy on 'setProperty' to verify CSS variables are written
      const styleSpy = vi.spyOn(documentMock.documentElement.style, 'setProperty');

      // Mock the Favicon element interaction
      const mockLinkElement = documentMock.createElement('link');
      // If the app queries for an icon, give it our mock
      vi.spyOn(documentMock, 'querySelector').mockReturnValue(mockLinkElement);

      // Trigger the signal update manually
      service.config.set({
        branding: {
          logoUrl: 'test.png',
          primaryColor: '#00FF00', // Green
          faviconUrl: 'new-icon.ico',
        },
      });

      // FLUSH EFFECTS: Critical step for testing Signal effects
      TestBed.flushEffects();

      // Verify CSS Variables (Theme)
      // We expect it to have generated material palette vars
      expect(styleSpy).toHaveBeenCalled();
      // Check for a specific generated variable (e.g., primary color)
      expect(styleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/--mat-sys-color-primary/),
        expect.any(String)
      );

      // Verify Favicon
      expect(mockLinkElement.href).toContain('new-icon.ico');
    });
  });
});
