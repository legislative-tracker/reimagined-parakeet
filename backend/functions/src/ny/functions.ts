import got, { Options } from "got";
import { APIKEY } from "./api-keys";
import popolo, { Identifier } from "popolo-types";
import api from "nys-openlegislation-types";

const options = new Options({
  prefixUrl: "https://legislation.nysenate.gov/api/3/",
  responseType: "json",
  resolveBodyOnly: true,
  method: "GET",
  searchParams: {
    key: APIKEY,
    full: "true",
    limit: 1000,
  },
});

interface Legislator extends popolo.Person {
  id: string;
  sponsorships?: {
    billId: string;
    version: string;
    name: string;
  }[];
}

interface Legislation extends popolo.Motion {
  id: string;
  title?: string;
  version?: string;
  cosponsors?: {
    [key: string]: Identifier[];
  };
}

export const updateMembers = async (): Promise<Legislator[]> => {
  let year: number = new Date().getFullYear();
  if (year % 2 === 0) year--;

  const instance = got.extend(options);

  try {
    const res = await instance("members/" + year);
    if (isSuccess<api.FullMember[]>(res)) {
      if (isItemsResponse<api.FullMember[]>(res.result)) {
        const legislators: Legislator[] = res.result.items.map(
          (m: api.FullMember) => mapAPIMemberToLegislator(m)
        );
        return legislators;
      } else {
        const error: Error = new Error(JSON.stringify(res));
        throw error;
      }
    } else {
      const error: Error = new Error(JSON.stringify(res));
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateBills = async (billList: Legislation[]) => {
  return await Promise.all(
    billList.map(async (bill: Legislation) => {
      const billParts: string[] = bill.id.split("-");
      const instance = got.extend(options);
      try {
        const res = await instance(
          `bills/${billParts.pop()}/${billParts.pop()}`
        );
        if (isSuccess<api.Bill>(res)) {
          if (!isItemsResponse<api.Bill>(res.result)) {
            return mapAPIBillToLegislation(res.result);
          } else {
            throw new Error(
              "Expected single bill, but received items response."
            );
          }
        } else {
          throw new Error("Fetch failed");
        }
      } catch (error) {
        console.error(`Error fetching bill ${bill.id}:`, error);
        throw error;
      }
    })
  );
};

const generateSortName = (p: api.FullMember["person"]): string => {
  let sortName = p.lastName;

  if (p.suffix != "") sortName += ` ${p.suffix}`;

  sortName += `, ${p.firstName}`;

  if (p.middleName != "") sortName += ` ${p.middleName}`;

  return sortName;
};

const generateLegislatorId = (name: string): string => {
  return name.replaceAll(".", "").replaceAll(" ", "-");
};

const mapAPIMemberToLegislator = (m: api.FullMember): Legislator => {
  const legislator: Legislator = {
    id: generateLegislatorId(m.fullName),
    name: m.fullName,
    given_name: m.person.firstName,
    family_name: m.person.lastName,
    additional_name: m.person.middleName,
    honorific_prefix: m.person.prefix,
    honorific_suffix: m.person.suffix,
    sort_name: generateSortName(m.person),
    email: m.person.email,
    image: m.imgName,
    identifiers: [
      {
        identifier: m.shortName,
        scheme: "session short name",
      },
      {
        identifier: `${m.person.personId}`,
        scheme: "person id",
      },
      {
        identifier: `${m.memberId}`,
        scheme: "member id",
      },
      {
        identifier: `${m.sessionMemberId}`,
        scheme: "session member id",
      },
    ],
    memberships: [
      {
        id: m.chamber,
        label: "chamber & district",
        area_id: `${m.districtCode}`,
      },
    ],
    updated_at: new Date().toISOString(),
  };
  return legislator;
};

const mapAPIBillToLegislation = (b: api.Bill): Legislation => {
  const legislation: Legislation = {
    id: b.basePrintNoStr,
    version: b.activeVersion,
    legislative_session_id: `${b.session}`,
    organization_id: b.billType.chamber,
    title: b.title,
    date: b.publishedDateTime,
    text: b.summary,
    cosponsors: getCosponsors(b),
    updated_at: new Date().toISOString(),
  };

  return legislation;
};

const getCosponsors = (b: api.Bill): { [key: string]: Identifier[] } => {
  const cosponsorsByVersion: { [key: string]: Identifier[] } = {};
  const amendmentVersions: string[] = b.amendmentVersions.items;

  amendmentVersions.forEach((v: string) => {
    const cosponsors: Identifier[] = [];
    b.amendments.items[v].coSponsors.items.forEach((c: api.Member) =>
      cosponsors.push({
        identifier: generateLegislatorId(c.fullName),
        scheme: "legislator id",
      })
    );
    cosponsorsByVersion[v === "" ? "Original" : v] = cosponsors;
  });

  return cosponsorsByVersion;
};

const isSuccess = <T>(v: unknown): v is api.APIResponseSuccess<T> => {
  if ((v as api.APIResponseSuccess<T>).success === true) return true;
  return false;
};

const isItemsResponse = <T>(v: unknown): v is api.Items<T> => {
  if ((v as api.Items<T>).items) return true;
  return false;
};
