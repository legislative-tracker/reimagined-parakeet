import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class BillService {
  private firestore = inject(Firestore);

  // 1. Reference the nested path
  private nyLegislationRef = collection(this.firestore, 'legislatures/ny/legislation');

  // 2. Wrap in query() to ensure it meets the Expected type '_Query'
  private nyLegislationQuery = query(this.nyLegislationRef);

  // 3. Convert to a signal for your Angular 21 component
  readonly bills = toSignal(collectionData(this.nyLegislationQuery, { idField: 'id' }), {
    initialValue: [],
  });
}
