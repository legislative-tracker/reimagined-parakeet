import got from "got";
import api from "nys-openlegislation-types";
import { defineSecret } from "firebase-functions/params";
import { Legislator, Legislation, Cosponsor } from "../../models/legislature";

const nySenateKey = defineSecret("NY_SENATE_KEY");

const isSuccess = <T>(v: unknown): v is api.APIResponseSuccess<T> => {
  if ((v as api.APIResponseSuccess<T>).success === true) return true;
  return false;
};
const isItemsResponse = <T>(v: unknown): v is api.Items<T> => {
  if ((v as api.Items<T>).items) return true;
  return false;
};

export const updateMembers = async (): Promise<Legislator[]> => {
  const options = {
    prefixUrl: "https://legislation.nysenate.gov/api/3/",
    responseType: "json" as const,
    resolveBodyOnly: true,
    searchParams: {
      key: nySenateKey.value(),
      full: "true",
      limit: 1000,
    },
  };

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

export const updateBills = async (billList: string[]) => {
  const options = {
    prefixUrl: "https://legislation.nysenate.gov/api/3/",
    responseType: "json" as const,
    resolveBodyOnly: true,
    searchParams: {
      key: nySenateKey.value(),
      full: "true",
      limit: 1000,
    },
  };

  return await Promise.all(
    billList.map(async (bill: string) => {
      const billParts: string[] = bill.split("-");
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
        console.error(`Error fetching bill ${bill}:`, error);
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

const mapAPIMemberToLegislator = (m: api.FullMember): Legislator => {
  const legislator: Legislator = {
    id: m.fullName.replaceAll(".", "").replaceAll(" ", "-"),
    name: m.fullName,
    given_name: m.person.firstName,
    family_name: m.person.lastName,
    additional_name: m.person.middleName,
    honorific_prefix: m.person.prefix,
    honorific_suffix: m.person.suffix,
    sort_name: generateSortName(m.person),
    email: m.person.email,
    image: m.imgName,
    chamber: m.chamber,
    district: `${m.districtCode}`,
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

const getCosponsors = (b: api.Bill): { [key: string]: Cosponsor[] } => {
  const cosponsorsByVersion: { [key: string]: Cosponsor[] } = {};
  const amendmentVersions: string[] = b.amendmentVersions.items;

  amendmentVersions.forEach((v: string) => {
    const cosponsors: Cosponsor[] = [];
    b.amendments.items[v].coSponsors.items.forEach((c: api.Member) =>
      cosponsors.push({
        id: c.fullName.replaceAll(".", "").replaceAll(" ", "-"),
        name: c.fullName,
        chamber: c.chamber,
        district: `${c.districtCode}`,
      })
    );
    cosponsorsByVersion[v === "" ? "Original" : v] = cosponsors;
  });

  return cosponsorsByVersion;
};
