export interface SearchAddress {
  address: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: number;
}

export interface ShippingAddress extends SearchAddress {
  company?: string | null;
  firstName: string | null;
  lastName: string | null;
  shipping: string | null;
}
