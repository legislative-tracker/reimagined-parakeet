import { Injectable, inject, computed } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import type { SystemStatusResponse } from '@legislative-tracker/shared-data-models';

/**
 * Service to manage Legislature state and configuration.
 * Acts as the bridge between the Firebase Backend and the UI Components.
 */
@Injectable({
  providedIn: 'root',
})
export class LegislatureService {
  private readonly functions = inject(Functions);

  /**
   * Reference to the backend callable function.
   * We type the response explicitly with our Shared DTO.
   */
  private readonly getSystemStatusFn = httpsCallable<
    void,
    SystemStatusResponse
  >(this.functions, 'getSystemStatus');

  /**
   * Async Signal that holds the raw system status from the backend.
   * It triggers the fetch immediately upon service initialization.
   */
  private readonly systemStatusResource = toSignal(
    from(this.getSystemStatusFn()).pipe(
      map((result) => result.data),
      catchError((err) => {
        console.error('Failed to load system status', err);
        // Fallback to empty state in case of network error
        return of({
          enabledLegislatures: [],
          version: 'unknown',
        } as SystemStatusResponse);
      }),
      shareReplay(1), // Prevent duplicate calls if subscribed multiple times
    ),
    { initialValue: null },
  );

  // --- Computed Signals for the UI ---

  /**
   * Read-only signal returning the list of enabled legislature codes (e.g., 'us-ny').
   * Use this to render the map or sidebar.
   */
  public readonly supportedLegislatures = computed(() => {
    const status = this.systemStatusResource();
    return status?.enabledLegislatures || [];
  });

  /**
   * Signal indicating if the system configuration is currently loading.
   */
  public readonly isLoading = computed(
    () => this.systemStatusResource() === null,
  );

  /**
   * Helper to check if a specific state is supported.
   * @param stateCd The state code to check (e.g., 'us-ny')
   */
  public isStateSupported(stateCd: string): boolean {
    const supported = this.supportedLegislatures();
    return supported.includes(stateCd.toLowerCase());
  }
}
