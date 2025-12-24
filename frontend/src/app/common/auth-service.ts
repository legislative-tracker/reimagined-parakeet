import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { switchMap, of, tap } from 'rxjs';

interface Bill {
  id: string;
}

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

  async makeUserAdmin(email: string) {
    // 1. Reference the callable function by name
    const addAdminRole = httpsCallable(this.functions, 'addAdminRole');

    try {
      // 2. Trigger the function with the payload
      // The Cloud Function expects "request.data.email", so we pass { email }
      const result = await addAdminRole({ email });

      console.log('Promotion successful:', result.data);
      return result;
    } catch (error: any) {
      console.error('Promotion failed:', error);
      // Re-throw so the UI component can show the specific error message
      throw error;
    }
  }

  async makeAdminUser(email: string) {
    // 1. Reference the callable function by name
    const removeAdminRole = httpsCallable(this.functions, 'removeAdminRole');

    try {
      // 2. Trigger the function with the payload
      // The Cloud Function expects "request.data.email", so we pass { email }
      const result = await removeAdminRole({ email });

      console.log('Demotion successful:', result.data);
      return result;
    } catch (error: any) {
      console.error('Demotion failed:', error);
      // Re-throw so the UI component can show the specific error message
      throw error;
    }
  }

  async addBill(state: string, billData: Bill) {
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
