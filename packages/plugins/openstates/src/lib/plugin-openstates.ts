const BASE_URL = 'https://v3.openstates.org';

export const fetchLegislators = async (
  jurisdiction: string,
  API_KEY: string,
) => {
  const params = new URLSearchParams({
    apikey: API_KEY,
    jurisdiction: jurisdiction,
    per_page: '50',
  });

  let currPage = 1;
  let maxPage = 1;
  const totalResults = [];

  do {
    const url = `${BASE_URL}/people?${params.toString()}&page=${currPage}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) throw new Error('No data returned by OpenStates API');
    if (!data.pagination)
      throw new Error('Unexpected results returned by API call\n' + url);

    totalResults.push(...data.results);

    maxPage = data.pagination.max_page;
    console.log(`Fetched page ${currPage} of ${maxPage}`);
    currPage++;
  } while (currPage <= maxPage);

  return await Promise.all(totalResults);
};
