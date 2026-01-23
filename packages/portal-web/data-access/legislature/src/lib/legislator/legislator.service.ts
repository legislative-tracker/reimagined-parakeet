import { Injectable, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { type Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type { Legislator } from '@legislative-tracker/shared-data-models';

/**
 * Service responsible for managing Legislators (People/Members).
 * Handles read-only operations from Firestore as member data is synced via backend.
 */
@Injectable({ providedIn: 'root' })
export class LegislatorService {
  private readonly app = inject(FirebaseApp);

  /**
   * Generates the Firestore collection path for a state's legislators.
   * @param stateCode - The 2-letter state code.
   * @returns The Firestore path string.
   */
  private getCollectionPath(stateCode: string): string {
    return `legislatures/${stateCode.toUpperCase()}/legislators`;
  }

  /**
   * Fetches all legislators for a specific state.
   * @param stateCode - The 2-letter state code.
   * @returns An Observable array of Legislator objects.
   */
  getMembersByState(stateCode: string): Observable<Legislator[]> {
    return from(import('@angular/fire/firestore')).pipe(
      switchMap((firestoreLib) => {
        const firestore = firestoreLib.getFirestore(this.app);
        const path = this.getCollectionPath(stateCode);
        const membersRef = firestoreLib.collection(firestore, path);

        return firestoreLib.collectionData(membersRef, {
          idField: 'id',
        }) as Observable<Legislator[]>;
      }),
    );
  }

  /**
   * Fetches a single legislator by their ID.
   * @param stateCode - The ISO state code (e.g., 'US-NY').
   * @param id - The unique ID of the legislator.
   * @returns An Observable of the Legislator object.
   */
  getMemberById(stateCode: string, id: string): Observable<Legislator> {
    return from(import('@angular/fire/firestore')).pipe(
      switchMap((firestoreLib) => {
        const firestore = firestoreLib.getFirestore(this.app);
        const path = `${this.getCollectionPath(stateCode)}/${id}`;
        const memberRef = firestoreLib.doc(firestore, path);

        return firestoreLib.docData(memberRef, {
          idField: 'id',
        }) as Observable<Legislator>;
      }),
    );
  }
}
