import { Motion, Identifier } from "popolo-types";

export interface Legislation extends Motion {
  id: string;
  title?: string;
  version?: string;
  cosponsors?: {
    [key: string]: Identifier[];
  };
}
