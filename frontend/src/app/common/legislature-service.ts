import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegislatureService {
  private firestore = inject(Firestore);

  // This method fetches all state legislation
  getBillsByState(stateCode: string): Observable<any[]> {
    const billsRef = collection(this.firestore, `legislatures/${stateCode}/legislation`);
    return collectionData(billsRef, { idField: 'id' });
  }

  // This method fetches all state legislators
  getMembersByState(stateCode: string): Observable<any[]> {
    const membersRef = collection(this.firestore, `legislatures/${stateCode}/legislators`);
    return collectionData(membersRef, { idField: 'id' });
  }

  // This method fetches a single bill within a state legislature
  getBillById(stateCode: string, id: string): Observable<any> {
    const billRef = doc(this.firestore, `legislatures/${stateCode}/legislation/${id}`);
    return docData(billRef, { idField: 'id' });
  }

  // This method fetches a single member within a state legislature
  getMemberById(stateCode: string, id: string): Observable<any> {
    const memberRef = doc(this.firestore, `legislatures/${stateCode}/legislators/${id}`);
    return docData(memberRef, { idField: 'id' });
  }
}
