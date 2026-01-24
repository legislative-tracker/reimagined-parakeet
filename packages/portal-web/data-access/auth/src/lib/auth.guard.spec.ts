import { TestBed } from '@angular/core/testing';
import {
  Router,
  type UrlTree,
  type CanActivateFn,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';
import type { User } from '@angular/fire/auth';
import { Auth, authState } from '@angular/fire/auth';
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import { of, Observable, lastValueFrom } from 'rxjs';

import { adminGuard } from './admin.guard';

/**
 * Mocks the specific Firebase Auth functions we rely on.
 * @description We use a partial mock for @angular/fire/auth to intercept authState.
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
   * Helper to execute the functional guard within Angular's injection context.
   */
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let routerSpy: { createUrlTree: Mock };

  /** * Resolved 'no-explicit-any': Cast empty object to unknown then Auth
   * to satisfy the dependency injection token without a full implementation.
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
    // Resolved 'no-explicit-any': Cast authState to Vitest Mock for type safety
    (authState as Mock).mockReturnValue(of(null));

    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.mockReturnValue(mockUrlTree);

    const result = await runGuard();

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(mockUrlTree);
  });

  it('should redirect to / (Home) if user is logged in but NOT admin', async () => {
    /** * Mock a standard user.
     * We cast to unknown then User to provide only the necessary methods for the test.
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
   * Helper to handle the Observable/UrlTree/boolean return types of the guard.
   * @description Converts the Guard's return value to a Promise for easy async/await testing.
   */
  async function runGuard(): Promise<boolean | UrlTree> {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    // The guard returns an Observable<boolean | UrlTree> | Promise<...> | boolean | UrlTree
    const result = executeGuard(route, state);

    if (result instanceof Observable) {
      return await lastValueFrom(result);
    }

    return result as boolean | UrlTree;
  }
});
