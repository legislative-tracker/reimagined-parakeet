export type LegislativeSession = {
  identifier: string;
  name: string;
  classification: string;
  start_date: string;
  end_date: string;
  downloads: {
    url: string;
    data_type: string;
    created_at: string;
    updated_at: string;
  }[];
};
