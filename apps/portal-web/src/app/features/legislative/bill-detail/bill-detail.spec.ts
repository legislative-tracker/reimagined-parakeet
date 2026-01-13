import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

// Target Component
import { BillDetail } from './bill-detail.js';

// Dependencies
import { LegislatureService } from '../../../core/services/legislature/legislature.service.js';
import { TableComponent } from '../../../shared/table/table.component.js';

// -------------------------------------------------------------------------
// Stub Child Components
// -------------------------------------------------------------------------

/**
 * @description A mock version of the TableComponent used to isolate the BillDetail tests.
 * Refactored to use modern Signal-based inputs to comply with @angular-eslint rules.
 */
@Component({
  selector: 'app-table',
  template: '',
  standalone: true,
})
class MockTableComponent {
  /** The data to be displayed in the table. */
  public readonly dataSource = input<unknown[]>([]);
  /** Configuration for the table columns. */
  public readonly columnSource = input<unknown[]>([]);
}

describe('BillDetail', () => {
  let component: BillDetail;
  let fixture: ComponentFixture<BillDetail>;

  /** Mock bill data including structured cosponsors for transformation testing. */
  const mockBillData = {
    id: 'BILL-123',
    title: 'Clean Water Act',
    description: 'A bill to ensure clean water.',
    session: '2024',
    cosponsors: {
      'AMENDED-A': [{ name: 'Rep. Smith', id: '1' }],
      ORIGINAL: [
        { name: 'Rep. Doe', id: '2' },
        { name: 'Rep. Jones', id: '3' },
      ],
    },
  };

  /** Mock service implementation using Vitest spy functions. */
  const mockLegislatureService = {
    getBillById: vi.fn().mockReturnValue(of(mockBillData)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillDetail], // Standalone
      providers: [
        provideNoopAnimations(), // Prevent MatTabs animation errors
        { provide: LegislatureService, useValue: mockLegislatureService },
      ],
    })
      // Override TableComponent with Stub
      .overrideComponent(BillDetail, {
        remove: { imports: [TableComponent] },
        add: { imports: [MockTableComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BillDetail);
    component = fixture.componentInstance;

    // Initialize Required Inputs using the Signal-safe setInput method
    fixture.componentRef.setInput('stateCd', 'ny');
    fixture.componentRef.setInput('id', 'BILL-123');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch bill details with correct params on init', async () => {
    // rxResource triggers immediately, but we wait for stability to ensure signals resolve
    await fixture.whenStable();

    expect(mockLegislatureService.getBillById).toHaveBeenCalledWith('ny', 'BILL-123');

    const bill = component.bill();
    expect(bill?.title).toBe('Clean Water Act');
  });

  it('should transform cosponsors object into billVersions array', async () => {
    await fixture.whenStable(); // Wait for data to settle

    const versions = component.billVersions();

    // Verification of the transformation logic: Object.entries mapped to { id, data }
    expect(versions.length).toBe(2);

    const originalVer = versions.find((v) => v.id === 'ORIGINAL');
    expect(originalVer).toBeDefined();
    expect(originalVer?.data.length).toBe(2); // Rep. Doe, Rep. Jones

    const amendedVer = versions.find((v) => v.id === 'AMENDED-A');
    expect(amendedVer).toBeDefined();
    expect(amendedVer?.data[0].name).toBe('Rep. Smith');
  });

  it('should handle missing cosponsors gracefully', async () => {
    // Mock service returning bill with null cosponsors
    mockLegislatureService.getBillById.mockReturnValueOnce(
      of({
        id: 'BILL-999',
        title: 'Empty Bill',
        cosponsors: null,
      }),
    );

    // Change Input ID to trigger refetch via rxResource
    fixture.componentRef.setInput('id', 'BILL-999');
    fixture.detectChanges();
    await fixture.whenStable();

    // Verify transformation handles null safely
    const versions = component.billVersions();
    expect(versions).toEqual([]);
  });

  it('should refetch data when inputs change', async () => {
    mockLegislatureService.getBillById.mockClear();

    // Change State and ID inputs
    fixture.componentRef.setInput('stateCd', 'ca');
    fixture.componentRef.setInput('id', 'BILL-456');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockLegislatureService.getBillById).toHaveBeenCalledWith('ca', 'BILL-456');
  });
});
