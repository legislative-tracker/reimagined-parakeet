import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
} from '@angular/material/snack-bar';

/**
 * Data contract for the LinkSnackBar component.
 */
export interface LinkSnackBarData {
  /** The primary message to display in the snackbar */
  message: string;
  /** The text to show on the action button */
  linkText: string;
  /** The destination URL for the link action */
  linkUrl: string;
}

/**
 * A reusable Material Snackbar component that supports an actionable link.
 * @description This component uses Angular's inject() function for dependency injection
 * to maintain compatibility with modern Zoneless and Signal-based patterns.
 */
@Component({
  selector: 'app-link-snackbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './link-snackbar.html',
  styleUrls: ['./link-snackbar.scss'],
})
export class LinkSnackBar {
  /** Reference to the snackbar instance for controlling visibility and lifecycle */
  public readonly snackBarRef = inject(MatSnackBarRef<LinkSnackBar>);

  /** The data injected into the snackbar via the MAT_SNACK_BAR_DATA token */
  public readonly data = inject<LinkSnackBarData>(MAT_SNACK_BAR_DATA);
}
