export type TokenUpdate = {
  id: {
    [key: string]: number | string;
  };
  contentType: string;
  sourceId: string;
  sourceDateTime: string;
  processedDateTime: string;
};

export interface DigestUpdate extends TokenUpdate {
  action: string;
  scope: string;
  fields: {
    [key: string]: string;
  };
  fieldCount: number;
}
