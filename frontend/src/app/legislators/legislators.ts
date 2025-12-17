export interface LegislatorShort {
  fname: string;
  lname: string;
  district: number;
  party: string;
}

export const ASSEMBLY_MEMBERS: LegislatorShort[] = [
  { fname: 'Jane', lname: 'Doe', district: 1, party: 'Democrat' },
  { fname: 'John', lname: 'Doe', district: 2, party: 'Republican' },
  { fname: 'Jack', lname: 'Horner', district: 3, party: 'Democrat' },
  { fname: 'Jill', lname: 'Tate', district: 4, party: 'Republican' },
  { fname: 'Joe', lname: 'Guy', district: 5, party: 'Democrat' },
  { fname: 'Jim', lname: 'Manly', district: 6, party: 'Republican' },
  { fname: 'Jerry', lname: 'Falwell', district: 7, party: 'Democrat' },
  { fname: 'Jeff', lname: 'Comey', district: 8, party: 'Independant' },
  { fname: 'Jenny', lname: 'Ortega', district: 9, party: 'Democrat' },
];

export const SENATORS: LegislatorShort[] = [
  { fname: 'Jimminy', lname: 'Cricket', district: 1, party: 'Democrat' },
  { fname: 'John', lname: 'Mulaney', district: 2, party: 'Democrat' },
  { fname: 'Jack', lname: 'Reacher', district: 3, party: 'Democrat' },
  { fname: 'Jill', lname: 'Stein', district: 4, party: 'Green' },
  { fname: 'Joe', lname: 'Montagna', district: 5, party: 'Democrat' },
  { fname: 'Jim', lname: 'Fix', district: 6, party: 'Republican' },
  { fname: 'Jerry', lname: 'Seinfeld', district: 7, party: 'Democrat' },
  { fname: 'Jeff', lname: 'Block', district: 8, party: 'Independant' },
  { fname: 'Jenny', lname: 'Lane', district: 9, party: 'Democrat' },
];