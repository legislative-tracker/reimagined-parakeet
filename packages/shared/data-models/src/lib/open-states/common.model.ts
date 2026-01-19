export type Link = {
  url: string;
  note: string;
};

export type Identifier = {
  identifier: string;
  scheme: string;
};

export type Extras = {
  [key: string]: string;
};

export type Role = {
  title: string;
  org_classification: string;
  district: string;
  division_id: string;
};

export type Document = {
  id: string;
  note: string;
  date: string;
  classification: string;
  links: Link[];
};

export interface Media extends Document {
  offset: number;
}
