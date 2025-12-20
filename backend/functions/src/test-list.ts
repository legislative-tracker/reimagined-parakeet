import { Motion } from "popolo-types";

interface Legislation extends Motion {
  id: string;
  title?: string;
  version?: string;
  sponsors?: {
    legislatorId: string;
    name: string;
  }[];
}
export const testList: Legislation[] = [
  { id: "S14-2025" },
  { id: "A140-2025" },
];
