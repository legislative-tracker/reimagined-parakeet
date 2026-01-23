import type { Legislator } from './legislator.model';

export interface AppUser {
  displayName: string;
  email: string;
  uid: string;
  lastLogin: string;
  photoURL: string;
  phoneNumber?: string;
  districts: {
    federal: string;
    state: {
      lower: string;
      upper: string;
    };
  };
  legislators: {
    federal: Legislator[];
    state: Legislator[];
  };
  favorites?: string[];
}
