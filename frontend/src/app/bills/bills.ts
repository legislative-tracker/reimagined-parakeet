export interface BillShort {
  id: string;
  title: string;
  date: string;
  version: string;
}

export const BILLS: BillShort[] = [
  {
    id: 'A1',
    title: 'NY Hero Act',
    date: '2025-12-17T14:12:23+00:00',
    version: '',
  },
  {
    id: 'A2',
    title: 'COVID-19 Related Death Due to Occupational Exposure',
    date: '2025-09-06T15:23:45+00:00',
    version: 'D',
  },
  {
    id: 'A3',
    title: 'Workers Comp for PTSD',
    date: '2025-04-09T03:59:44+00:00',
    version: 'A',
  },
  {
    id: 'S1',
    title: 'Healthcare Worker Hazard Pay',
    date: '2025-01-20T10:00:00+00:00',
    version: 'B',
  },
  {
    id: 'S2',
    title: 'Public Health Emergency Leave',
    date: '2025-11-15T09:30:00+00:00',
    version: '',
  },
];
