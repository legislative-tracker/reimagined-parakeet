import { TestBed } from '@angular/core/testing';
import { LegislatureService } from './legislature-service';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock Firestore & Functions Modules
// We need to capture the standalone functions like 'collection' and 'doc'
vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/fire/firestore')>();
  return {
    ...actual,
    collection: vi.fn(),
    collectionData: vi.fn(),
    doc: vi.fn(),
    docData: vi.fn(),
  };
});

vi.mock('@angular/fire/functions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/fire/functions')>();
  return {
    ...actual,
    httpsCallable: vi.fn(),
  };
});

describe('LegislatureService', () => {
  let service: LegislatureService;
  // Dummy objects to satisfy DI
  const mockFirestore = {};
  const mockFunctions = {};

  beforeEach(() => {
    // Define Default Behavior for Mocks
    // These return generic refs so the service doesn't crash on init
    (collection as any).mockReturnValue('mock-collection-ref');
    (doc as any).mockReturnValue('mock-doc-ref');
    (collectionData as any).mockReturnValue(of([]));
    (docData as any).mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        LegislatureService,
        { provide: Firestore, useValue: mockFirestore },
        { provide: Functions, useValue: mockFunctions },
      ],
    });

    service = TestBed.inject(LegislatureService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Read Operations (Firestore)', () => {
    it('should fetch bills for a specific state', () => {
      const mockBills = [{ id: 'bill-1', title: 'Tax Reform' }];
      (collectionData as any).mockReturnValue(of(mockBills));

      service.getBillsByState('ny').subscribe((result) => {
        expect(result).toEqual(mockBills);
      });

      // Verify the path logic: legislatures/ny/legislation
      expect(collection).toHaveBeenCalledWith(mockFirestore, 'legislatures/ny/legislation');
      expect(collectionData).toHaveBeenCalledWith('mock-collection-ref', { idField: 'id' });
    });

    it('should fetch members for a specific state', () => {
      service.getMembersByState('tx').subscribe();

      // Verify path logic: legislatures/tx/legislators
      expect(collection).toHaveBeenCalledWith(mockFirestore, 'legislatures/tx/legislators');
    });

    it('should fetch a single bill by ID', () => {
      const mockBill = { id: 'bill-99', title: 'Specific Bill' };
      (docData as any).mockReturnValue(of(mockBill));

      service.getBillById('ny', 'bill-99').subscribe((result) => {
        expect(result).toEqual(mockBill);
      });

      // Verify path logic: legislatures/ny/legislation/bill-99
      expect(doc).toHaveBeenCalledWith(mockFirestore, 'legislatures/ny/legislation/bill-99');
      expect(docData).toHaveBeenCalledWith('mock-doc-ref', { idField: 'id' });
    });

    it('should fetch a single member by ID', () => {
      service.getMemberById('ny', 'mem-500').subscribe();

      // Verify path logic: legislatures/ny/legislators/mem-500
      expect(doc).toHaveBeenCalledWith(mockFirestore, 'legislatures/ny/legislators/mem-500');
    });
  });

  describe('Admin Operations (Cloud Functions)', () => {
    it('should call "addBill" cloud function', async () => {
      // Mock the specific callable
      const mockCallable = vi.fn().mockResolvedValue({ data: 'Created' });
      (httpsCallable as any).mockReturnValue(mockCallable);

      // Execute
      const billData: any = { title: 'New Law', session: '2025' };
      await service.addBill('ny', billData);

      // Verify
      expect(httpsCallable).toHaveBeenCalledWith(mockFunctions, 'addBill');
      expect(mockCallable).toHaveBeenCalledWith({ state: 'ny', bill: billData });
    });

    it('should call "removeBill" cloud function', async () => {
      const mockCallable = vi.fn().mockResolvedValue({ data: 'Removed' });
      (httpsCallable as any).mockReturnValue(mockCallable);

      await service.removeBill('ny', 'bill-ABC');

      expect(httpsCallable).toHaveBeenCalledWith(mockFunctions, 'removeBill');
      expect(mockCallable).toHaveBeenCalledWith({ state: 'ny', billId: 'bill-ABC' });
    });

    it('should propagate errors if cloud function fails', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Permission Denied'));
      (httpsCallable as any).mockReturnValue(mockCallable);

      // Assert that the promise rejects
      await expect(service.removeBill('ny', 'bill-fail')).rejects.toThrow('Permission Denied');
    });
  });
});
