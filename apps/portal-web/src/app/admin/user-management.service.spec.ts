import { TestBed } from '@angular/core/testing';
import { FirebaseApp } from '@angular/fire/app';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { UserManagementService } from './user-management.service.js';

/**
 * @description Mock constants used to spy on Firebase Functions initialization.
 */
const mockHttpsCallable = vi.fn();
const mockGetFunctions = vi.fn();

/**
 * Intercepts the dynamic import of @angular/fire/functions to provide controlled mocks.
 * @description Uses unknown[] rest parameters to resolve 'no-explicit-any' linting errors.
 */
vi.mock('@angular/fire/functions', () => ({
  getFunctions: (...args: unknown[]) => mockGetFunctions(...args),
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

/**
 * @description Unit tests for UserManagementService.
 * Verifies that administrative privilege granting and revoking correctly trigger
 * the corresponding Firebase Cloud Functions.
 */
describe('UserManagementService', () => {
  let service: UserManagementService;
  const mockFirebaseApp = { name: '[DEFAULT]' };

  beforeEach(() => {
    // Reset all mock state before each test to ensure isolation.
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [UserManagementService, { provide: FirebaseApp, useValue: mockFirebaseApp }],
    });

    service = TestBed.inject(UserManagementService);

    // Spy on console to verify logs and keep the test output environment clean.
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original implementations to avoid polluting other test suites.
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('grantAdminPrivileges', () => {
    /**
     * @description Ensures the service correctly handles a successful promotion of a user.
     */
    it('should call "addAdminRole" cloud function and return result', async () => {
      const successResponse = { data: { message: 'Success' } };
      const callableFn = vi.fn().mockResolvedValue(successResponse);
      mockHttpsCallable.mockReturnValue(callableFn);

      const email = 'test@example.com';
      const result = await service.grantAdminPrivileges(email);

      // Verify that the Firebase SDK was initialized with the correct app instance.
      expect(mockGetFunctions).toHaveBeenCalledWith(mockFirebaseApp);
      expect(mockHttpsCallable).toHaveBeenCalledWith(undefined, 'admin-addAdminRole');

      // Verify that the specific email was passed to the cloud function.
      expect(callableFn).toHaveBeenCalledWith({ email });
      expect(console.log).toHaveBeenCalledWith('Promotion successful:', successResponse.data);
      expect(result).toEqual(successResponse);
    });

    /**
     * @description Ensures the service propagates errors when a promotion fails.
     */
    it('should handle errors when granting privileges fails', async () => {
      const errorObj = new Error('Permission Denied');
      const callableFn = vi.fn().mockRejectedValue(errorObj);
      mockHttpsCallable.mockReturnValue(callableFn);

      await expect(service.grantAdminPrivileges('fail@example.com')).rejects.toThrow(
        'Permission Denied',
      );

      expect(console.error).toHaveBeenCalledWith('Promotion failed:', errorObj);
    });
  });

  describe('revokeAdminPrivileges', () => {
    /**
     * @description Ensures the service correctly handles a successful demotion of an administrator.
     */
    it('should call "removeAdminRole" cloud function and return result', async () => {
      const successResponse = { data: { message: 'Demoted' } };
      const callableFn = vi.fn().mockResolvedValue(successResponse);
      mockHttpsCallable.mockReturnValue(callableFn);

      const email = 'admin@example.com';
      const result = await service.revokeAdminPrivileges(email);

      expect(mockHttpsCallable).toHaveBeenCalledWith(undefined, 'admin-removeAdminRole');

      expect(callableFn).toHaveBeenCalledWith({ email });
      expect(console.log).toHaveBeenCalledWith('Demotion successful:', successResponse.data);
      expect(result).toEqual(successResponse);
    });

    /**
     * @description Ensures the service propagates errors when a demotion fails.
     */
    it('should handle errors when revoking privileges fails', async () => {
      const errorObj = new Error('Network Error');
      const callableFn = vi.fn().mockRejectedValue(errorObj);
      mockHttpsCallable.mockReturnValue(callableFn);

      await expect(service.revokeAdminPrivileges('fail@example.com')).rejects.toThrow(
        'Network Error',
      );

      expect(console.error).toHaveBeenCalledWith('Demotion failed:', errorObj);
    });
  });
});
