import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  // 1. Convert the Firebase user observable to a Signal
  // This will automatically update when the user logs in or out
  private userSignal = toSignal(user(this.auth));

  // 2. Expose specific states for the UI
  currentUser = computed(() => this.userSignal());
  isLoggedIn = computed(() => !!this.userSignal());

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Login failed', error);
      return null;
    }
  }

  async logout() {
    return await signOut(this.auth);
  }
}
