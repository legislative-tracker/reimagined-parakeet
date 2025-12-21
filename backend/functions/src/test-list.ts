import { Motion } from "popolo-types";

interface Legislation extends Motion {
  id: string;
}
export const testList: Legislation[] = [
  { id: "S14-2025" },
  { id: "A140-2025" },
];
