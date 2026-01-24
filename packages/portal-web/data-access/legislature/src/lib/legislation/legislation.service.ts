import { Injectable, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { type Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type { Legislation } from '@legislative-tracker/shared-data-models';

/**
 * Service responsible for managing Legislative Bills (Legislation).
 * Handles Firestore reads and Cloud Function writes for bill data.
 */
@Injectable({ providedIn: 'root' })
export class LegislationService {
  private readonly app = inject(FirebaseApp);

  /**
   * Generates the Firestore collection path for a state's legislation.
   * @param stateCode - The iso state code (e.g., 'US-NY').
   * @returns The Firestore path string.
   */
  private getCollectionPath(stateCode: string): string {
    return `legislatures/${stateCode.toUpperCase()}/legislation`;
  }

  /**
   * Fetches all legislation (bills) for a specific state.
   * @param stateCode - The ISO state code (e.g., 'US-NY').
   * @returns An Observable array of Legislation objects.
   */
  getBillsByState(stateCode: string): Observable<Legislation[]> {
    return from(import('@angular/fire/firestore')).pipe(
      switchMap((firestoreLib) => {
        const firestore = firestoreLib.getFirestore(this.app);
        const path = this.getCollectionPath(stateCode);
        const billsRef = firestoreLib.collection(firestore, path);

        return firestoreLib.collectionData(billsRef, {
          idField: 'id',
        }) as Observable<Legislation[]>;
      }),
    );
  }

  /**
   * Fetches a single bill by its ID within a specific state.
   * @param stateCode - The ISO state code (e.g., 'US-NY').
   * @param id - The unique ID of the bill.
   * @returns An Observable of the Legislation object.
   */
  getBillById(stateCode: string, id: string): Observable<Legislation> {
    return from(import('@angular/fire/firestore')).pipe(
      switchMap((firestoreLib) => {
        const firestore = firestoreLib.getFirestore(this.app);
        const path = `${this.getCollectionPath(stateCode)}/${id}`;
        const billRef = firestoreLib.doc(firestore, path);

        return firestoreLib.docData(billRef, {
          idField: 'id',
        }) as Observable<Legislation>;
      }),
    );
  }

  /**
   * Triggers a Cloud Function to add a new bill to the system.
   * @param stateCode - The ISO state code (e.g., 'US-NY').
   * @param billData - The Legislation object payload.
   * @returns The result of the Cloud Function call.
   */
  async addBill(state: string, billData: Partial<Legislation>) {
    const { getFunctions, httpsCallable } = await import(
      '@angular/fire/functions'
    );
    const functions = getFunctions(this.app);
    const addBillFn = httpsCallable(functions, 'legislation-addBill');

    try {
      const result = await addBillFn({ state, bill: billData });
      return result;
    } catch (error) {
      console.error('Failed to create bill:', error);
      throw error;
    }
  }

  /**
   * Triggers a Cloud Function to remove a bill from the system.
   * @param stateCode - The ISO state code (e.g., 'US-NY').
   * @param billId - The ID of the bill to remove.
   * @returns The result of the Cloud Function call.
   */
  async removeBill(state: string, billId: string) {
    const { getFunctions, httpsCallable } = await import(
      '@angular/fire/functions'
    );
    const functions = getFunctions(this.app);
    const removeBillFn = httpsCallable(functions, 'legislation-removeBill');

    try {
      const result = await removeBillFn({ state, billId });
      return result;
    } catch (error) {
      console.error('Failed to remove bill:', error);
      throw error;
    }
  }
}
