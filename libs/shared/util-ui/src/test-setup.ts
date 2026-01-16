import "@angular/compiler";
import "@analogjs/vitest-angular/setup-snapshots";
import { setupTestBed } from "@analogjs/vitest-angular/setup-testbed";

/**
 * Initializes the Angular testing environment.
 * setupTestBed() defaults to 'zoneless: true' for modern Angular applications.
 */
setupTestBed();
