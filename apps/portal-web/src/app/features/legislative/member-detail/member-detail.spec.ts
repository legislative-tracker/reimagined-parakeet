import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive, input } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

// Target Component
import { MemberDetail } from './member-detail.js';

// Dependencies
import { LegislatureService } from '../../../core/services/legislature.service.js';
import { TableComponent } from '../../../shared/table/table.component.js';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.js';
import { Legislator } from '../../../models/legislature.js';

// -------------------------------------------------------------------------
// Create Stubs for Children (Isolation)
// -------------------------------------------------------------------------

/**
 * @description Mock TableComponent refactored to use Signal-based inputs.
 * This resolves the '@angular-eslint/no-inputs-metadata-property' linting error.
 */
@Component({
  selector: 'app-table',
  template: '',
  standalone: true,
})
class MockTableComponent {
  public readonly dataSource = input<unknown[]>([]);
  public readonly columnSource = input<unknown[]>([]);
}

/**
 * @description Mock ImgFallbackDirective refactored to use Signal-based inputs.
 * Resolves metadata property errors and aligns with modern Angular patterns.
 */
@Directive({
  selector: 'img[appImgFallback]',
  standalone: true,
})
class MockImgFallbackDirective {
  public readonly appImgFallback = input<string>('');
}

describe('MemberDetail', () => {
  let component: MemberDetail;
  let fixture: ComponentFixture<MemberDetail>;

  /**
   * Mock Legislator data for testing.
   * Provides a full representation of the Legislator interface to avoid casting.
   */
  const mockLegislator: Legislator = {
    id: '123',
    name: 'Jane Doe',
    chamber: 'SENATE',
    district: '123',
    honorific_prefix: 'Senator',
    party: 'Democratic',
    sponsorships: [
      { id: 'BILL-1', title: 'Clean Energy Act', version: '' },
      { id: 'BILL-2', title: 'Road Safety Act', version: 'A' },
    ],
  };

  /** * Mock service implementation using Vitest spy functions.
   */
  const mockLegislatureService = {
    getMemberById: vi.fn().mockReturnValue(of(mockLegislator)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberDetail],
      providers: [
        provideNoopAnimations(),
        { provide: LegislatureService, useValue: mockLegislatureService },
      ],
    })
      // Swap real dependencies for isolated mocks
      .overrideComponent(MemberDetail, {
        remove: { imports: [TableComponent, ImgFallbackDirective] },
        add: { imports: [MockTableComponent, MockImgFallbackDirective] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MemberDetail);
    component = fixture.componentInstance;

    // Initialize Required Inputs using the Signal-safe setInput method
    fixture.componentRef.setInput('stateCd', 'ny');
    fixture.componentRef.setInput('id', '123');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMemberById with correct params on initialization', () => {
    expect(mockLegislatureService.getMemberById).toHaveBeenCalledWith('ny', '123');
  });

  it('should update member signal when resource resolves', () => {
    const memberData = component.member();

    expect(memberData).toBeDefined();
    expect(memberData?.name).toBe('Jane Doe');
    expect(memberData?.chamber).toBe('SENATE');
    expect(memberData?.district).toBe('123');
    expect(memberData?.party).toBe('Democratic');
    expect(memberData?.honorific_prefix).toBe('Senator');
  });

  it('should compute sponsorships correctly', () => {
    const sponsorships = component.sponsorships();

    expect(sponsorships.length).toBe(2);
    expect(sponsorships[0].title).toBe('Clean Energy Act');
  });

  it('should default sponsorships to empty array if member is undefined', () => {
    mockLegislatureService.getMemberById.mockReturnValueOnce(of(null));

    fixture.componentRef.setInput('id', '999');
    fixture.detectChanges();

    expect(component.member()).toBeFalsy();
    expect(component.sponsorships()).toEqual([]);
  });

  it('should refetch data when inputs change', () => {
    mockLegislatureService.getMemberById.mockClear();

    fixture.componentRef.setInput('stateCd', 'ca');
    fixture.componentRef.setInput('id', '456');
    fixture.detectChanges();

    expect(mockLegislatureService.getMemberById).toHaveBeenCalledWith('ca', '456');
  });
});
