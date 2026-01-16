import got from "got";
import { openStatesKey } from "../../config.js";
import { Person } from "@jpstroud/opencivicdata-types";
import { OSResponse } from "./types.js";

const BASE_URL = "https://v3.openstates.org";

/**
 * Generic function to fetch paginated data from OpenStates
 * @param {string} jurisdiction - The state/jurisdiction name (e.g., "New York", "California")
 * @param {string} targetEndpoint - The API endpoint suffix (e.g., "people", "committees")
 */
export const getOpenStatesData = async (
  jurisdiction: string,
  targetEndpoint: string
): Promise<Person[]> => {
  const url = `${BASE_URL}/${targetEndpoint}`;
  console.log(`Fetching ${targetEndpoint} for ${jurisdiction}...`);

  try {
    const results = await got.paginate.all<Person, OSResponse<Person>>(url, {
      responseType: "json",
      searchParams: {
        jurisdiction: jurisdiction,
        page: 1,
        per_page: 50,
        apikey: openStatesKey.value(),
      },
      pagination: {
        transform: (response) => {
          return response.body.results;
        },
        paginate: ({ response }) => {
          const { pagination } = response.body;
          const previousParams = response.request.options
            .searchParams as URLSearchParams;

          const currentPage = Number(previousParams.get("page") || 1);
          const lastPage = pagination.max_page;

          if (currentPage >= lastPage) {
            return false;
          }

          return {
            searchParams: {
              apikey: openStatesKey.value(),
              jurisdiction: jurisdiction,
              per_page: 50,
              page: currentPage + 1,
            },
          };
        },
      },
    });

    return results;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching ${targetEndpoint}: ${error.message}`);
    } else {
      console.error("An unexpected error occurred:", error);
    }

    return [];
  }
};
