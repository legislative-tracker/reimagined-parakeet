import type { LegislativeSession } from './legislative-session.model';
import type { Organization } from './organization.model';

export type JurisdictionStub = {
  id: string;
  name: string;
  classification: 'country' | 'state' | 'municipality';
};

export interface Jurisdiction extends JurisdictionStub {
  division_id?: string;
  url?: string;
  latest_bill_update?: string;
  latest_people_update?: string;
  organizations?: Organization[];
  legislative_sessions?: LegislativeSession[];
  latest_runs?: {
    success: boolean;
    start_time: string;
    end_time: string;
  }[];
}
