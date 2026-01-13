import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Auth, authState, User } from '@angular/fire/auth';
import { vi, describe, it, expect, beforeEach, afterEach, type Mock } from 'vitest';
import { of, Observable, lastValueFrom } from 'rxjs';

import { adminGuard } from './admin.guard.js';

/**
 * Mocks the specific Firebase Auth functions required for the guard.
 * @description We intercept the authState observable to control the simulated login status.
 */
vi.mock('@angular/fire/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/fire/auth')>();
  return {
    ...actual,
    authState: vi.fn(),
  };
});

describe('adminGuard', () => {
  /**
   * Helper to execute the functional guard within an Angular Injection Context.
   */
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let routerSpy: { createUrlTree: Mock };

  /** * Resolved 'no-explicit-any': Cast an empty object to Auth via unknown.
   * This provides a valid token for the DI container without a full implementation.
   */
  const mockAuth = {} as unknown as Auth;

  beforeEach(() => {
    routerSpy = { createUrlTree: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /login if user is not authenticated', async () => {
    // Resolved 'no-explicit-any': Cast authState to Mock for type-safe mock control.
    (authState as Mock).mockReturnValue(of(null));

    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.mockReturnValue(mockUrlTree);

    const result = await runGuard();

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(mockUrlTree);
  });

  it('should redirect to / (Home) if user is logged in but NOT admin', async () => {
    /** * Mock a standard user.
     * We cast a partial object to User to provide the getIdTokenResult method.
     */
    const mockUser = {
      getIdTokenResult: vi.fn().mockResolvedValue({
        claims: { admin: false },
      }),
    } as unknown as User;

    (authState as Mock).mockReturnValue(of(mockUser));

    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.mockReturnValue(mockUrlTree);

    const result = await runGuard();

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/']);
    expect(result).toBe(mockUrlTree);
  });

  it('should allow access (return true) if user IS admin', async () => {
    const mockUser = {
      getIdTokenResult: vi.fn().mockResolvedValue({
        claims: { admin: true },
      }),
    } as unknown as User;

    (authState as Mock).mockReturnValue(of(mockUser));

    const result = await runGuard();

    expect(result).toBe(true);
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  /**
   * Helper to handle the complex return type of CanActivateFn.
   * @description Resolves 'no-explicit-any' by properly handling the Observable or literal result.
   * @returns A promise resolving to the final boolean or UrlTree.
   */
  async function runGuard(): Promise<boolean | UrlTree> {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = executeGuard(route, state);

    // If the guard returns an Observable, convert it to a Promise using lastValueFrom
    if (result instanceof Observable) {
      return await lastValueFrom(result);
    }

    return result as boolean | UrlTree;
  }
});
