import { Person } from "popolo-types";

export interface OSResponse<T> {
  results: T[];
  pagination: {
    per_page: number;
    page: number;
    max_page: number;
    total_items: number;
  };
}

export interface OSPerson extends Person {
  id: string;
  name: string;
  party: string;
  current_role: {
    title: string;
    org_classification: string;
    district: string;
    division_id: string;
  };
  jurisdiction: {
    id: string;
    name: string;
    classification: string;
  };
  given_name: string;
  family_name: string;
  image: string;
  email: string;
  birth_date: string;
  death_date: string;
  extras: {
    [key: string]: string;
  };
  created_at: string;
  updated_at: string;
  openstates_url: string;
}
