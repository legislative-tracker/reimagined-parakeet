export interface BillShort {
    id: string;
    title: string;
    publishedDateTime: string;
    activeVersion: string;
}

export const BILLS: BillShort[] = [
  {
    id: 'A1',
    title: 'NY Hero Act',
    publishedDateTime: '2025-12-17T14:12:23+00:00',
    activeVersion: '',
  },
  {
    id: 'A2',
    title: 'COVID-19 Related Death Due to Occupational Exposure',
    publishedDateTime: '2025-09-06T15:23:45+00:00',
    activeVersion: 'D',
  },
  {
    id: 'A3',
    title: 'Workers Comp for PTSD',
    publishedDateTime: '2025-04-09T03:59:44+00:00',
    activeVersion: 'A',
  },  {
    id: 'S1',
    title: 'Healthcare Worker Hazard Pay',
    publishedDateTime: '2025-01-20T10:00:00+00:00',
    activeVersion: 'B',
  },
  {
    id: 'S2',
    title: 'Public Health Emergency Leave',
    publishedDateTime: '2025-11-15T09:30:00+00:00',
    activeVersion: '',
  },
  
];