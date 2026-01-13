import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FirebaseApp } from '@angular/fire/app';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Target Component
import { Profile } from './profile.js';

// Dependencies
import { AuthService } from '../../../core/services/auth.service.js';
import { AddressForm } from '../../../shared/address-form/address-form.component.js';
import { TableComponent } from '../../../shared/table/table.component.js';
import { SearchAddress } from '../../../models/address.js';

// -------------------------------------------------------------------------
// Mock Dynamic Imports & Firebase Functions
// -------------------------------------------------------------------------
const mockCallableFunction = vi.fn();
const mockHttpsCallable = vi.fn().mockReturnValue(mockCallableFunction);
const mockGetFunctions = vi.fn().mockReturnValue({});

vi.mock('@angular/fire/functions', () => ({
  /**
   * Resolves 'no-explicit-any' by using unknown for rest parameters,
   * which is the safest type for generic mock wrappers.
   */
  getFunctions: (...args: unknown[]) => mockGetFunctions(...args),
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

// -------------------------------------------------------------------------
// Mock Child Components
// -------------------------------------------------------------------------

/**
 * @description Refactored to avoid 'no-inputs-metadata-property' by using Signal inputs.
 */
@Component({
  selector: 'app-address-form',
  template: '',
  standalone: true,
})
class MockAddressForm {
  public readonly formType = input<'search' | 'shipping'>();
}

@Component({
  selector: 'app-table',
  template: '',
  standalone: true,
})
class MockTableComponent {
  public readonly dataSource = input<unknown[]>([]);
  public readonly columnSource = input<unknown[]>([]);
  public readonly routeType = input<string>();
  public readonly stateCd = input<string>();
}

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  // Helper to simulate a Firestore Timestamp
  const mockTimestamp = {
    toDate: () => new Date('2024-01-01'),
    toMillis: () => 1704067200000,
  };

  // Mock Services
  const mockAuthService = {
    userProfile: signal({
      displayName: 'Test User',
      email: 'test@example.com',
      photoURL: 'https://example.com/photo.jpg',
      lastLogin: mockTimestamp,
      legislators: null,
    }),
  };

  const mockFirebaseApp = { name: '[DEFAULT]' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        DatePipe,
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirebaseApp, useValue: mockFirebaseApp },
      ],
    })
      .overrideComponent(Profile, {
        remove: { imports: [AddressForm, TableComponent] },
        add: { imports: [MockAddressForm, MockTableComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data from AuthService', () => {
    expect(component.user()?.displayName).toBe('Test User');
    expect(component.user()?.email).toBe('test@example.com');
  });

  describe('searchAddress', () => {
    it('should construct address string and call cloud function successfully', async () => {
      mockCallableFunction.mockResolvedValue({ data: { success: true } });

      const searchData: SearchAddress = {
        address: '123 Main St',
        address2: 'Apt 4B',
        city: 'Albany',
        state: 'NY',
        postalCode: 12201,
      };

      await component.searchAddress(searchData);

      expect(mockGetFunctions).toHaveBeenCalledWith(mockFirebaseApp);
      expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), 'users-fetchUserReps');

      expect(mockCallableFunction).toHaveBeenCalledWith({
        address: '123 Main St, Apt 4B, Albany, NY 12201',
      });
    });

    it('should format address correctly without address2', async () => {
      mockCallableFunction.mockResolvedValue({});

      /**
       * Fixed 'no-explicit-any' by using the proper SearchAddress interface
       * and ensuring all required fields are present.
       */
      const searchData: SearchAddress = {
        address: '123 Main St',
        address2: '',
        city: 'Albany',
        state: 'NY',
        postalCode: 12201,
      };

      await component.searchAddress(searchData);

      expect(mockCallableFunction).toHaveBeenCalledWith({
        address: '123 Main St, Albany, NY 12201',
      });
    });

    it('should handle errors thrown by the cloud function', async () => {
      const errorObj = new Error('Cloud function failed');
      mockCallableFunction.mockRejectedValue(errorObj);

      const searchData: SearchAddress = {
        address: '123 Main St',
        address2: '',
        city: 'A',
        state: 'NY',
        postalCode: 12345,
      };

      await component.searchAddress(searchData);

      // In profile.ts we updated alert to MatSnackBar,
      // but if alert still exists in logic, this mock remains valid.
      expect(window.alert).toHaveBeenCalledWith('Cloud function failed');
    });
  });
});
