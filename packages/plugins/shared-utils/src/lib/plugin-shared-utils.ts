import type { Legislator } from '@legislative-tracker/shared-data-models';

export const isImage = (imgStr: string | undefined): boolean => {
  if (!imgStr) return false;
  const str = imgStr.trim();
  if (!str) return false;
  if (str.includes('no_image')) return false;
  return true;
};

export const isEmail = (emailStr: string | undefined): boolean => {
  if (!emailStr) return false;
  const str = emailStr.trim();
  if (!str) return false;
  if (!str.includes('@')) return false;
  return true;
};

export const mergeStateAndOSPeopleData = (
  stateData: Partial<Legislator>[],
  osData: Partial<Legislator>[],
) => {
  const now = new Date().toISOString();
  const warnings: string[] = [];

  const mergedData: Partial<Legislator>[] = stateData.flatMap(
    (m: Partial<Legislator>) => {
      const osMatch = osData.find(
        (p: Partial<Legislator>) =>
          m.current_role?.division_id === p.current_role?.division_id,
      );

      if (!osMatch) {
        warnings.push(
          `Unable to find a match for ${m.name} with ${m.current_role?.division_id}`,
        );
        return [];
      }

      return {
        id: m.id,
        name: m.name,
        given_name: m.given_name,
        family_name: m.family_name,
        sort_name: m.sort_name,
        party: osMatch.party,
        current_role: m.current_role,
        jurisdiction: osMatch.jurisdiction,
        image: isImage(m.image)
          ? m.image
          : isImage(osMatch.image)
            ? osMatch.image
            : '',
        email: isEmail(m.email)
          ? m.email
          : isEmail(osMatch.email)
            ? osMatch.email
            : '',
        gender: osMatch.gender,
        birth_date: osMatch.birth_date,
        death_date: osMatch.death_date,
        extras: osMatch.extras,
        created_at: m.created_at,
        updated_at: now,
        openstates_url: osMatch.openstates_url,
        other_identifiers: m.other_identifiers,
        other_names: osMatch.other_names,
        links: osMatch.links,
        sources: osMatch.sources,
        offices: osMatch.offices,
        sponsorships: m.sponsorships,
      };
    },
  );
  return {
    matched: `${stateData.length - warnings.length} of ${stateData.length}`,
    warnings: warnings,
    data: mergedData,
  };
};
