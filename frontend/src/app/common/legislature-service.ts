import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegislatureService {
  private firestore = inject(Firestore);

  // This method fetches legislation filtered by the 'state' field
  getBillsByState(stateCode: string): Observable<any[]> {
    const billsRef = collection(this.firestore, `legislatures/${stateCode}/legislation`);
    return collectionData(billsRef, { idField: 'id' });
  }

  // This method fetches legislators filtered by the 'state' field
  getMembersByState(stateCode: string): Observable<any[]> {
    const membersRef = collection(this.firestore, `legislatures/${stateCode}/legislators`);
    return collectionData(membersRef, { idField: 'id' });
  }
}
