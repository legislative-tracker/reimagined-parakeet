import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

// Target Service
import { UiService } from './ui.service.js';

// Dependencies
import { Feedback } from '../../shared/feedback/feedback.js';

/**
 * @description Unit tests for UiService to verify dialog orchestration logic.
 */
describe('UiService', () => {
  let service: UiService;

  /** * Resolved 'no-explicit-any': We define a structured object where 'open'
   * is explicitly typed as a Vitest Mock function.
   */
  let dialogSpy: { open: Mock };

  beforeEach(() => {
    /** * Create a spy for MatDialog.
     * Using vi.fn() creates a mock function that Vitest can track.
     */
    dialogSpy = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UiService,
        // Provide the spy instead of the real MatDialog infrastructure
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });

    service = TestBed.inject(UiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openFeedbackDialog', () => {
    /**
     * @description Verifies that the UI service triggers the Material Dialog
     * with the correct component and UI constraints.
     */
    it('should open the Feedback component with correct configuration', () => {
      // Execute the service method
      service.openFeedbackDialog();

      // Verify MatDialog.open was called exactly once
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);

      // Verify arguments: Component Class + specific Material Design Config Object
      expect(dialogSpy.open).toHaveBeenCalledWith(Feedback, {
        width: '500px',
        maxWidth: '90vw',
        disableClose: true,
        autoFocus: false,
      });
    });
  });
});
