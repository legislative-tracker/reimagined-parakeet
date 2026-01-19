export type LegislatureFnMap<T> = {
  [key: string]: {
    bills: (list: string[]) => Promise<T[]>;
    members: () => Promise<T[]>;
  };
};
