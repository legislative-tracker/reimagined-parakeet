import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BehaviorSubject, of } from 'rxjs';

// Target Service
import { AuthService } from './auth.service.js';

/**
 * @description Mocks for Firebase Firestore module.
 * Uses unknown[] for rest parameters to avoid 'no-explicit-any' errors.
 */
const mockDocData = vi.fn();
const mockSetDoc = vi.fn();
const mockDoc = vi.fn();
const mockGetFirestore = vi.fn().mockReturnValue({});

vi.mock('@angular/fire/firestore', () => ({
  getFirestore: (...args: unknown[]) => mockGetFirestore(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  docData: (...args: unknown[]) => mockDocData(...args),
}));

/**
 * @description Mocks for Firebase Auth module.
 * Refactored to use unknown types for stream and function arguments.
 */
const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();
const mockGoogleAuthProvider = vi.fn();

/**
 * Subject to control the "user(auth)" stream used by toSignal.
 * Initialized as unknown to prevent implicit 'any' usage.
 */
const authState$ = new BehaviorSubject<unknown>(null);

vi.mock('@angular/fire/auth', () => ({
  user: () => authState$,
  GoogleAuthProvider: class {
    constructor() {
      mockGoogleAuthProvider();
    }
  },
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  Auth: class {},
}));

/**
 * @description Unit tests for AuthService, covering authentication state,
 * Google login, and user preferences (favorites).
 */
describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  const mockAuth = {};
  const mockFirebaseApp = { name: '[DEFAULT]' };

  beforeEach(() => {
    vi.clearAllMocks();
    authState$.next(null);

    mockGetFirestore.mockReturnValue({});
    mockDocData.mockReturnValue(of({}));
    mockDoc.mockReturnValue({ path: 'dummy/ref' });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth },
        { provide: FirebaseApp, useValue: mockFirebaseApp },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Auth State Effects', () => {
    it('should initialize as logged out', () => {
      expect(service.userSig()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
      expect(service.isAdmin()).toBe(false);
    });

    it('should fetch user profile and admin claims when user logs in', async () => {
      const mockUser = {
        uid: '123',
        getIdTokenResult: vi.fn().mockResolvedValue({ claims: { admin: true } }),
      };

      const mockProfile = { uid: '123', displayName: 'Test User' };
      mockDocData.mockReturnValue(of(mockProfile));

      authState$.next(mockUser);

      await TestBed.flushEffects();
      // Wait for async effect body
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(service.userSig()).toEqual(mockUser);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.isAdmin()).toBe(true);

      expect(mockGetFirestore).toHaveBeenCalledWith(mockFirebaseApp);
      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users/123');
      expect(service.userProfile()).toEqual(mockProfile);
    });

    it('should reset state when user logs out', async () => {
      authState$.next({ uid: '123', getIdTokenResult: async () => ({ claims: {} }) });
      await TestBed.flushEffects();
      await new Promise((resolve) => setTimeout(resolve, 0));

      authState$.next(null);
      await TestBed.flushEffects();

      expect(service.userProfile()).toBeNull();
      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('loginWithGoogle', () => {
    it('should sign in via popup and save user to Firestore', async () => {
      const mockCredential = {
        user: {
          uid: '123',
          email: 'test@example.com',
          displayName: 'Test User',
          phoneNumber: null,
          photoURL: null,
        },
      };
      mockSignInWithPopup.mockResolvedValue(mockCredential);

      await service.loginWithGoogle();

      expect(mockGoogleAuthProvider).toHaveBeenCalled();
      expect(mockSignInWithPopup).toHaveBeenCalled();

      expect(mockGetFirestore).toHaveBeenCalled();
      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users/123');

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          uid: '123',
          email: 'test@example.com',
          displayName: 'Test User',
          lastLogin: expect.any(Date),
        }),
        { merge: true },
      );
    });
  });

  describe('logout', () => {
    it('should sign out and navigate to home', async () => {
      await service.logout();

      expect(mockSignOut).toHaveBeenCalledWith(mockAuth);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('toggleFavorite', () => {
    it('should add ID to favorites if not present', async () => {
      const mockProfile = { favorites: ['BILL_A'] };

      mockDocData.mockReturnValue(of(mockProfile));
      authState$.next({ uid: 'USER_1', getIdTokenResult: async () => ({ claims: {} }) });

      await TestBed.flushEffects();
      await new Promise((resolve) => setTimeout(resolve, 0));

      await service.toggleFavorite('BILL_B');

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        { favorites: ['BILL_A', 'BILL_B'] },
        { merge: true },
      );
    });

    it('should remove ID from favorites if already present', async () => {
      const mockProfile = { favorites: ['BILL_A', 'BILL_B'] };

      mockDocData.mockReturnValue(of(mockProfile));
      authState$.next({ uid: 'USER_1', getIdTokenResult: async () => ({ claims: {} }) });

      await TestBed.flushEffects();
      await new Promise((resolve) => setTimeout(resolve, 0));

      await service.toggleFavorite('BILL_A');

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        { favorites: ['BILL_B'] },
        { merge: true },
      );
    });

    it('should do nothing if user is not logged in', async () => {
      authState$.next(null);
      await TestBed.flushEffects();

      await service.toggleFavorite('BILL_1');

      expect(mockSetDoc).not.toHaveBeenCalled();
    });
  });
});
