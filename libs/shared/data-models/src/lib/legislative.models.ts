import { Person, Bill } from "@jpstroud/opencivicdata-types";

/**
 * @description Represents a member of a legislative body.
 * Extends the Open Civic Data 'Person' type with local legislative metadata.
 */
export interface Legislator extends Person {
  /** Formal prefix (e.g., 'Senator', 'Assemblymember') */
  honorific_prefix: string;
  /** Formal suffix (e.g., 'Jr.', 'III') */
  honorific_suffix: string;
  /** The legislative chamber (e.g., 'Upper', 'Lower') */
  chamber: string;
  /** The representative's district identifier */
  district: string;
  /** Additional naming conventions used in specific state contexts */
  additional_name: string;
  /** Formatted name used for alphabetical sorting */
  sort_name: string;
  /** * @description Optional list of legislative sponsorships.
   * Links the legislator to specific bills in the system.
   */
  sponsorships?: {
    id: string;
    version: string;
    title: string;
  }[];
}

/**
 * @description Represents a legislative bill or act.
 * Extends the Open Civic Data 'Bill' type with text and versioning metadata.
 */
export interface Legislation extends Bill {
  /** The most recent official identifier for the bill text */
  current_version: string;
  /** The full text content of the bill */
  text: string;
  /** * @description Map of cosponsors grouped by chamber or type.
   */
  cosponsors?: {
    [key: string]: Cosponsor[];
  };
}

/**
 * @description Minimal representative data for a bill cosponsor.
 */
export type Cosponsor = {
  /** System ID for the legislator */
  id: string;
  /** Full name of the cosponsor */
  name: string;
  /** Chamber they represent */
  chamber: string;
  /** Specific district represented */
  district: string;
};

/**
 * @description Wrapper for API success responses.
 * Used to standardize data flow between Cloud Functions and the Angular Frontend.
 */
export interface Success<T> {
  results: T;
}
