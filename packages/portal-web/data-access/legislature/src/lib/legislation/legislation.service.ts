import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { type Observable } from 'rxjs';
import type { Legislation } from '@legislative-tracker/shared-data-models';

/**
 * Service responsible for managing Legislative Bills (Legislation).
 * Uses AngularFire Signals-compatible Observables to stream data from Firestore.
 */
@Injectable({ providedIn: 'root' })
export class LegislationService {
  private readonly firestore = inject(Firestore);
  private readonly functions = inject(Functions);

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
    const path = this.getCollectionPath(stateCode);
    const billsRef = collection(this.firestore, path);
    return collectionData(billsRef, { idField: 'id' }) as Observable<
      Legislation[]
    >;
  }

  /**
   * Fetches a single bill by its ID within a specific state.
   * @param stateCode - The ISO state code (e.g., 'US-NY').
   * @param id - The unique ID of the bill.
   * @returns An Observable of the Legislation object.
   */
  getBillById(stateCode: string, id: string): Observable<Legislation> {
    const path = `${this.getCollectionPath(stateCode)}/${id}`;
    const billRef = doc(this.firestore, path);
    return docData(billRef, { idField: 'id' }) as Observable<Legislation>;
  }

  /**
   * Triggers a Cloud Function to add a new bill to the system.
   * @param state - The ISO state code (e.g., 'US-NY').
   * @param billData - The Legislation object payload.
   * @returns The result of the Cloud Function call.
   */
  async addBill(state: string, billData: Partial<Legislation>) {
    const addBillFn = httpsCallable(this.functions, 'legislation-addBill');
    try {
      return await addBillFn({ state, bill: billData });
    } catch (error) {
      console.error('Failed to create bill:', error);
      throw error;
    }
  }

  /**
   * Triggers a Cloud Function to remove a bill from the system.
   * @param state - The ISO state code (e.g., 'US-NY').
   * @param billId - The ID of the bill to remove.
   * @returns The result of the Cloud Function call.
   */
  async removeBill(state: string, billId: string) {
    const removeBillFn = httpsCallable(
      this.functions,
      'legislation-removeBill',
    );
    try {
      return await removeBillFn({ state, billId });
    } catch (error) {
      console.error('Failed to remove bill:', error);
      throw error;
    }
  }
}
