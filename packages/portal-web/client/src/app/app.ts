import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Firestore,
  collection,
  getDocs,
  limit,
  query,
} from '@angular/fire/firestore';
import { NxWelcome } from './nx-welcome';

@Component({
  standalone: true,
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * Injecting Firestore and triggering a light request to wake up the
   * Firebase App Check SDK and force the generation of a debug token
   * in the browser console.
   */
  private readonly firestore = inject(Firestore);
  protected title = 'portal-web';

  constructor() {
    this.triggerAppCheckHandshake();
  }

  /**
   * Executes a minimal Firestore query. Even if the 'handshake' collection
   * doesn't exist, the attempt to connect will trigger the App Check
   * provider to log the debug token to the console.
   */
  private async triggerAppCheckHandshake() {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const handshakeRef = collection(this.firestore, 'app-check-handshake');
      const q = query(handshakeRef, limit(1));
      await getDocs(q);
    } catch (err) {
      // Errors are expected if security rules are already active;
      // the token should still appear in the console before this point.
      console.debug('App Check handshake initialized.', err);
    }
  }
}
