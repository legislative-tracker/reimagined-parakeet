export type Person = {
  personId: number;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  prefix: string;
  suffix: string;
  verified: boolean;
  imgName: string;
};

export type SessionMember = {
  sessionMemberId: number;
  shortName: string;
  sessionYear: number;
  districtCode: number;
  alternate: boolean;
  memberId: number;
};

export interface Member extends SessionMember {
  chamber: 'SENATE' | 'ASSEMBLY';
  incumbent: boolean;
  fullName: string;
  imgName: string;
}

export interface FullMember extends Member {
  sessionMemberShortMap: { [key: string]: SessionMember };
  person: Person;
}
