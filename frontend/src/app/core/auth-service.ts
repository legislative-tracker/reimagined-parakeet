import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { switchMap, of, tap, Observable } from 'rxjs';

// App Imports
import { AppUser } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private functions = inject(Functions);
  private userSignal = toSignal(user(this.auth));

  currentUser = computed(() => this.userSignal());
  isLoggedIn = computed(() => !!this.userSignal());

  // Fetch the claims from the ID Token
  isAdmin = toSignal(
    toObservable(this.userSignal).pipe(
      switchMap(async (user) => {
        if (!user) return false;
        const token = await user.getIdTokenResult();
        return !!token.claims['admin'];
      })
    ),
    { initialValue: false }
  );

  private firebaseUser = toSignal(user(this.auth));

  userProfile = toSignal(
    toObservable(this.firebaseUser).pipe(
      switchMap((user) => {
        if (!user) return of(null);

        const userRef = doc(this.firestore, `users/${user.uid}`);
        return docData(userRef) as Observable<AppUser>;
      })
    )
  );

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);

    if (credential.user) {
      const userRef = doc(this.firestore, `users/${credential.user.uid}`);
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

  async logout() {
    return await signOut(this.auth);
  }

  async toggleFavorite(billId: string) {
    const profile = this.userProfile();
    if (!profile) return;

    const currentFavorites = profile.favorites || [];
    const newFavorites = currentFavorites.includes(billId)
      ? currentFavorites.filter((id: string) => id !== billId)
      : [...currentFavorites, billId];

    const userRef = doc(this.firestore, `users/${profile.uid}`);
    return setDoc(userRef, { favorites: newFavorites }, { merge: true });
  }

  async grantAdminPrivileges(email: string) {
    const addAdminRole = httpsCallable(this.functions, 'addAdminRole');

    try {
      const result = await addAdminRole({ email });

      console.log('Promotion successful:', result.data);
      return result;
    } catch (error: any) {
      console.error('Promotion failed:', error);
      throw error;
    }
  }

  async revokeAdminPrivileges(email: string) {
    const removeAdminRole = httpsCallable(this.functions, 'removeAdminRole');

    try {
      const result = await removeAdminRole({ email });

      console.log('Demotion successful:', result.data);
      return result;
    } catch (error: any) {
      console.error('Demotion failed:', error);
      throw error;
    }
  }
}
