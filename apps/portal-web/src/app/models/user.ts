import { Timestamp } from 'firebase/firestore';
import { Legislator } from './legislature';

export interface AppUser {
  displayName: string;
  email: string;
  uid: string;
  lastLogin: Timestamp;
  phoneNumber?: string;
  photoURL: string;
  districts: {
    federal: string;
    state: {
      assembly: string;
      senate: string;
    };
  };
  legislators: {
    federal: Legislator[];
    state: Legislator[];
  };
  favorites?: string[];
}
