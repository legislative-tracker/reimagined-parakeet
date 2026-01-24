export interface SearchAddress {
  address: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface ShippingAddress extends SearchAddress {
  company?: string | null;
  firstName: string | null;
  lastName: string | null;
  shipping: string | null;
}
