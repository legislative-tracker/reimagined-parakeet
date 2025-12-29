import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Legislation, Legislator } from '@models/legislature';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegislatureService {
  private firestore = inject(Firestore);
  private functions = inject(Functions);

  // provides a db path string for the 'get' functions
  private getPaths = (stateCd: string): { bills: string; members: string } => {
    return {
      bills: `legislatures/${stateCd}/legislation`,
      members: `legislatures/${stateCd}/legislators`,
    };
  };

  // This method fetches all state legislation
  getBillsByState(stateCode: string): Observable<Legislation[]> {
    const billsRef = collection(this.firestore, this.getPaths(stateCode).bills);
    return collectionData(billsRef, { idField: 'id' }) as Observable<Legislation[]>;
  }

  // This method fetches all state legislators
  getMembersByState(stateCode: string): Observable<Legislator[]> {
    const membersRef = collection(this.firestore, this.getPaths(stateCode).members);
    return collectionData(membersRef, { idField: 'id' }) as Observable<Legislator[]>;
  }

  // This method fetches a single bill within a state legislature
  getBillById(stateCode: string, id: string): Observable<Legislation> {
    const path = this.getPaths(stateCode).bills + `/${id}`;

    const billRef = doc(this.firestore, path);
    return docData(billRef, { idField: 'id' }) as Observable<Legislation>;
  }

  // This method fetches a single member within a state legislature
  getMemberById(stateCode: string, id: string): Observable<Legislator> {
    const path = this.getPaths(stateCode).members + `/${id}`;

    const memberRef = doc(this.firestore, path);
    return docData(memberRef, { idField: 'id' }) as Observable<Legislator>;
  }

  //ADMIN FUNCTIONS
  async addBill(state: string, billData: Legislation) {
    const addBill = httpsCallable(this.functions, 'addBill');

    try {
      const result = await addBill({ state, bill: billData });
      console.log('Bill created:', result.data);
      return result;
    } catch (error) {
      console.error('Failed to create bill:', error);
      throw error;
    }
  }

  async removeBill(state: string, billId: string) {
    const removeBill = httpsCallable(this.functions, 'removeBill');

    try {
      const result = await removeBill({ state, billId });
      console.log('Bill created:', result.data);
      return result;
    } catch (error) {
      console.error('Failed to create bill:', error);
      throw error;
    }
  }
}
