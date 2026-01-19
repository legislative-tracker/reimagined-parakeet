export type OrganizationStub = {
  id: string;
  name: string;
  classification: string;
};

export interface Organization extends OrganizationStub {
  districts?: {
    label: string;
    role: string;
    division_id: string;
    maximum_memberships: number;
  }[];
}
