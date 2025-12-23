import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private userSignal = toSignal(user(this.auth));

  currentUser = computed(() => this.userSignal());
  isLoggedIn = computed(() => !!this.userSignal());

  private firebaseUser = toSignal(user(this.auth));

  userProfile = toSignal(
    toObservable(this.firebaseUser).pipe(
      switchMap((user) => {
        if (!user) return of(null);

        const userRef = doc(this.firestore, `users/${user.uid}`);
        return docData(userRef);
      })
    )
  );

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);

    if (credential.user) {
      const userRef = doc(this.firestore, `users/${credential.user.uid}`);
      // Use { merge: true } to avoid overwriting existing data
      await setDoc(
        userRef,
        {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          lastLogin: new Date(),
        },
        { merge: true }
      );
    }
    return credential;
  }

  async logout() {
    return await signOut(this.auth);
  }

  async toggleFavorite(billId: string) {
    const user = this.firebaseUser();
    if (!user) return;

    const currentFavorites = (this.userProfile() as any)?.favorites || [];
    const newFavorites = currentFavorites.includes(billId)
      ? currentFavorites.filter((id: string) => id !== billId)
      : [...currentFavorites, billId];

    const userRef = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userRef, { favorites: newFavorites }, { merge: true });
  }
}
