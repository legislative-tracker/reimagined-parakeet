import { TestBed } from '@angular/core/testing';
import { FirebaseApp } from '@angular/fire/app';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { FeedbackService } from './feedback.service.js';

// -------------------------------------------------------------------------
// Mock Dynamic Imports (Firebase Functions)
// -------------------------------------------------------------------------

/**
 * Mock function to simulate the return of the Firebase Functions instance.
 */
const mockGetFunctions = vi.fn();

/**
 * Mock function to simulate the creation of a callable HTTPS function.
 */
const mockHttpsCallable = vi.fn();

/**
 * Intercept the dynamic "await import(...)" call for @angular/fire/functions.
 * @description Uses unknown[] rest parameters to resolve 'no-explicit-any' linting errors
 * while maintaining the ability to proxy all arguments to the underlying Vitest spies.
 */
vi.mock('@angular/fire/functions', () => ({
  getFunctions: (...args: unknown[]) => mockGetFunctions(...args),
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

describe('FeedbackService', () => {
  let service: FeedbackService;
  const mockFirebaseApp = { name: '[DEFAULT]' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeedbackService, { provide: FirebaseApp, useValue: mockFirebaseApp }],
    });
    service = TestBed.inject(FeedbackService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendFeedback', () => {
    /**
     * @description Verifies that sendFeedback triggers the correct Firebase Function
     * with the expected title and body payload.
     */
    it('should call the "submitAnonymousIssue" cloud function with correct payload', async () => {
      // Setup the callable function spy
      const mockResponse = { data: { success: true, message: 'Received' } };

      // The httpsCallable factory returns a function (the actual API caller)
      const callableFn = vi.fn().mockResolvedValue(mockResponse);
      mockHttpsCallable.mockReturnValue(callableFn);

      const title = 'Bug Report';
      const body = 'Something went wrong.';

      // Call the service method
      const result = await service.sendFeedback(title, body);

      // Verify Lazy Loading & Setup
      expect(mockGetFunctions).toHaveBeenCalledWith(mockFirebaseApp);
      expect(mockHttpsCallable).toHaveBeenCalledWith(undefined, 'submitAnonymousIssue');

      // Verify Payload
      expect(callableFn).toHaveBeenCalledWith({ title, body });

      // Verify Return Value
      expect(result).toEqual(mockResponse.data);
    });

    /**
     * @description Ensures the service propagates errors correctly when the
     * underlying Cloud Function fails.
     */
    it('should throw an error if the cloud function fails', async () => {
      // Setup failure scenario
      const callableFn = vi.fn().mockRejectedValue(new Error('Network Error'));
      mockHttpsCallable.mockReturnValue(callableFn);

      // Call and Assert Rejection
      await expect(service.sendFeedback('Title', 'Body')).rejects.toThrow('Network Error');
    });
  });
});
