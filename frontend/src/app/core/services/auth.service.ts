import { Injectable, inject, signal, computed, Injector } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { AppUser } from '@models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private app = inject(FirebaseApp);

  // Signals
  userSig = signal<User | null>(null);
  userProfile = signal<AppUser | null>(null);

  // Computed Signals
  isLoggedIn = computed(() => !!this.userSig());

  // Secure Admin Check (Initialized to false)
  isAdmin = signal<boolean>(false);

  constructor() {
    // Subscribe to the lightweight Auth State (Core Auth SDK only)
    user(this.auth).subscribe(async (user) => {
      this.userSig.set(user);

      if (user) {
        // Secure Admin Check (Auth SDK only, no Firestore needed)
        // We use the ID Token because it is cryptographically signed and secure.
        const token = await user.getIdTokenResult();
        this.isAdmin.set(!!token.claims['admin']);

        // Lazy Load User Profile (Firestore SDK)
        this.fetchUserProfile(user.uid);
      } else {
        this.userProfile.set(null);
        this.isAdmin.set(false);
      }
    });
  }

  /**
   * Lazy loads Firestore and subscribes to the user's profile document.
   */
  private async fetchUserProfile(uid: string) {
    const { getFirestore, doc, docData } = await import('@angular/fire/firestore');

    const firestore = getFirestore(this.app);
    const userDoc = doc(firestore, `users/${uid}`);

    docData(userDoc).subscribe((data) => {
      this.userProfile.set(data as AppUser);
    });
  }

  /**
   * Logs the user in with Google and updates their User Record in Firestore.
   * Lazily loads both Auth Providers and Firestore.
   */
  async loginWithGoogle() {
    // Lazy Load Auth Logic
    const { GoogleAuthProvider, signInWithPopup } = await import('@angular/fire/auth');

    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);

    // Lazy Load Firestore to save/update the user record
    if (credential.user) {
      const { getFirestore, doc, setDoc } = await import('@angular/fire/firestore');
      const firestore = getFirestore(this.app);

      const userRef = doc(firestore, `users/${credential.user.uid}`);
      await setDoc(
        userRef,
        {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          photoURL: credential.user.photoURL || null,
          phoneNumber: credential.user.phoneNumber,
          lastLogin: new Date(),
        },
        { merge: true }
      );
    }
    return credential;
  }

  /**
   * Logs the user out and clears state.
   */
  async logout() {
    // Lazy Load SignOut Logic
    const { signOut } = await import('@angular/fire/auth');

    await signOut(this.auth);

    // Explicitly clear signals (optional, as the user subscription will also fire null)
    this.userSig.set(null);
    this.userProfile.set(null);
    this.isAdmin.set(false);

    this.router.navigate(['/']);
  }

  /**
   * Toggles a bill as a favorite.
   * Lazily loads Firestore to perform the write.
   */
  async toggleFavorite(billId: string) {
    const profile = this.userProfile();
    const currentUser = this.userSig();

    if (!profile || !currentUser) return;

    const currentFavorites = profile.favorites || [];
    const newFavorites = currentFavorites.includes(billId)
      ? currentFavorites.filter((id: string) => id !== billId)
      : [...currentFavorites, billId];

    // Lazy Load Firestore for the write operation
    const { getFirestore, doc, setDoc } = await import('@angular/fire/firestore');
    const firestore = getFirestore(this.app);

    const userRef = doc(firestore, `users/${currentUser.uid}`);
    return setDoc(userRef, { favorites: newFavorites }, { merge: true });
  }
}
