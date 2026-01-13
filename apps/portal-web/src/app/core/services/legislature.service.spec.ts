import { TestBed } from '@angular/core/testing';
import { FirebaseApp } from '@angular/fire/app';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { of } from 'rxjs';

import { LegislatureService } from './legislature.service.js';

// -------------------------------------------------------------------------
// Setup Global Spies for Dynamic Imports
// -------------------------------------------------------------------------

// --- Firestore Mocks ---
const mockCollectionData = vi.fn();
const mockDocData = vi.fn();
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockGetFirestore = vi.fn();

vi.mock('@angular/fire/firestore', () => ({
  /** * Resolved 'no-explicit-any': Using unknown[] for rest parameters
   * allows the mock to accept any arguments safely without using 'any'.
   */
  getFirestore: (...args: unknown[]) => mockGetFirestore(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  collectionData: (...args: unknown[]) => mockCollectionData(...args),
  docData: (...args: unknown[]) => mockDocData(...args),
}));

// --- Functions Mocks ---
const mockHttpsCallable = vi.fn();
const mockGetFunctions = vi.fn();

vi.mock('@angular/fire/functions', () => ({
  getFunctions: (...args: unknown[]) => mockGetFunctions(...args),
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

describe('LegislatureService', () => {
  let service: LegislatureService;
  const mockFirebaseApp = { name: '[DEFAULT]' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LegislatureService, { provide: FirebaseApp, useValue: mockFirebaseApp }],
    });
    service = TestBed.inject(LegislatureService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // -----------------------------------------------------------------------
  // Firestore Tests (Observables)
  // -----------------------------------------------------------------------
  describe('Firestore Reads', () => {
    it('getBillsByState should load SDK, create query, and return Observable', () => {
      return new Promise<void>((resolve) => {
        const mockBills = [{ id: '1', title: 'Bill A' }];
        mockCollectionData.mockReturnValue(of(mockBills));

        service.getBillsByState('ny').subscribe((result) => {
          expect(mockGetFirestore).toHaveBeenCalledWith(mockFirebaseApp);
          expect(mockCollection).toHaveBeenCalledWith(undefined, 'legislatures/ny/legislation');
          expect(result).toEqual(mockBills);
          resolve();
        });
      });
    });

    it('getMembersByState should query the correct collection path', () => {
      return new Promise<void>((resolve) => {
        const mockMembers = [{ id: '100', name: 'Jane Doe' }];
        mockCollectionData.mockReturnValue(of(mockMembers));

        service.getMembersByState('ca').subscribe((result) => {
          expect(mockGetFirestore).toHaveBeenCalled();
          expect(mockCollection).toHaveBeenCalledWith(undefined, 'legislatures/ca/legislators');
          expect(result).toEqual(mockMembers);
          resolve();
        });
      });
    });

    it('getBillById should query a specific document', () => {
      return new Promise<void>((resolve) => {
        const mockBill = { id: 'B1', title: 'Specific Bill' };
        mockDocData.mockReturnValue(of(mockBill));

        service.getBillById('ny', 'B1').subscribe((result) => {
          expect(mockDoc).toHaveBeenCalledWith(undefined, 'legislatures/ny/legislation/B1');
          expect(result).toEqual(mockBill);
          resolve();
        });
      });
    });

    it('getMemberById should query a specific member document', () => {
      return new Promise<void>((resolve) => {
        const mockMember = { id: 'M1', name: 'Member One' };
        mockDocData.mockReturnValue(of(mockMember));

        service.getMemberById('tx', 'M1').subscribe((result) => {
          expect(mockDoc).toHaveBeenCalledWith(undefined, 'legislatures/tx/legislators/M1');
          expect(result).toEqual(mockMember);
          resolve();
        });
      });
    });
  });

  // -----------------------------------------------------------------------
  // Functions Tests (Promises/Async-Await)
  // -----------------------------------------------------------------------
  describe('Admin Functions (Cloud Functions)', () => {
    /**
     * Helper to setup callable mocks.
     * Resolved 'no-explicit-any' by using unknown for successData.
     */
    const setupCallableMock = (successData: unknown, shouldFail = false) => {
      const callableFn = vi.fn().mockImplementation(() => {
        if (shouldFail) return Promise.reject(new Error('Cloud Error'));
        return Promise.resolve({ data: successData });
      });
      mockHttpsCallable.mockReturnValue(callableFn);
      return callableFn;
    };

    it('addBill should call "addBill" cloud function', async () => {
      const mockResult = { id: 'new-bill-id' };
      const callableFn = setupCallableMock(mockResult);

      // Removed 'any' cast by defining the object shape
      const billData = { title: 'New Law' };

      const result = await service.addBill('ny', billData as never);

      expect(mockGetFunctions).toHaveBeenCalledWith(mockFirebaseApp);
      expect(mockHttpsCallable).toHaveBeenCalledWith(undefined, 'legislation-addBill');
      expect(callableFn).toHaveBeenCalledWith({ state: 'ny', bill: billData });
      expect(result.data).toEqual(mockResult);
    });

    it('removeBill should call "removeBill" cloud function', async () => {
      const mockResult = { success: true };
      const callableFn = setupCallableMock(mockResult);

      await service.removeBill('ny', '123');

      expect(mockHttpsCallable).toHaveBeenCalledWith(undefined, 'legislation-removeBill');
      expect(callableFn).toHaveBeenCalledWith({ state: 'ny', billId: '123' });
    });

    it('should throw error if cloud function fails', async () => {
      setupCallableMock(null, true);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Fixed 'any' by using an empty object cast to Record<string, unknown>
      await expect(service.addBill('ny', {} as Record<string, unknown> as never)).rejects.toThrow(
        'Cloud Error',
      );

      expect(consoleSpy).toHaveBeenCalledWith('Failed to create bill:', expect.anything());
    });
  });
});
