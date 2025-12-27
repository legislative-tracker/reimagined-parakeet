import got from "got";
import { defineSecret } from "firebase-functions/params";
import { OSPerson, OSResponse } from "../models/openstates";
// import { HttpsError } from "firebase-functions/https";

const openStatesKey = defineSecret("OPENSTATES_KEY");

const BASE_URL = "https://v3.openstates.org";

/**
 * Generic function to fetch paginated data from OpenStates
 * @param jurisdiction - The state/jurisdiction name (e.g., "New York", "California")
 * @param targetEndpoint - The API endpoint suffix (e.g., "people", "committees")
 */
export async function getOpenStatesData(
  jurisdiction: string,
  targetEndpoint: string
): Promise<OSPerson[]> {
  // Construct the full URL (e.g., https://v3.openstates.org/people)
  const url = `${BASE_URL}/${targetEndpoint}`;

  console.log(`Fetching ${targetEndpoint} for ${jurisdiction}...`);

  try {
    // We pass our interfaces <OSPerson, OpenStatesResponse> to .all()
    const results = await got.paginate.all<OSPerson, OSResponse<OSPerson>>(
      url,
      {
        responseType: "json",
        searchParams: {
          jurisdiction: jurisdiction,
          page: 1,
          per_page: 50,
          apikey: openStatesKey.value(),
        },
        pagination: {
          // Transform the response to extract the array of items
          transform: (response) => {
            return response.body.results;
          },

          // Calculate the next page options
          paginate: ({ response }) => {
            const { pagination } = response.body;

            // Type assertion for safety
            const previousParams = response.request.options
              .searchParams as URLSearchParams;

            const currentPage = Number(previousParams.get("page") || 1);
            const lastPage = pagination.max_page;

            if (currentPage >= lastPage) {
              return false;
            }

            return {
              searchParams: {
                ...Object.fromEntries(previousParams),
                page: currentPage + 1,
              },
            };
          },
        },
      }
    );

    return results;
  } catch (error: any) {
    console.error(`Failed to fetch data from ${url}:`, error.message);
    // Rethrow or return empty array depending on your error handling strategy
    throw error;
  }
}
