import type { Legislator } from '@legislative-tracker/shared-data-models';
import { mapToLegislators } from './map-legislators.js';
import { mapToLegislation } from './map-legislation.js';

// Base URL for the NY Senate's OpenLegislation API
const BASE_URL = 'https://legislation.nysenate.gov/api/3';

/**
 * Fetches all members of the New York Legislature's current session and maps
 * them to the internal 'Legislator' type
 * @param {string} API_KEY The NY OpenLegislation API Key
 * @returns An array of Legislator objects
 */
export const fetchMembers = async (API_KEY: string) => {
  const CURR_YEAR = new Date().getFullYear();
  const searchParams = new URLSearchParams({
    key: API_KEY,
    full: 'true',
    limit: '1000',
  });

  const url = `${BASE_URL}/members/${CURR_YEAR}?${searchParams.toString()}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) throw new Error('Failed to fetch NY legislators');
  if (!data.result.items) throw new Error('Unexpected response format');

  const legislators: Partial<Legislator>[] = mapToLegislators(
    data.result.items,
  );

  return legislators;
};

/**
 * Fetches the latest bill data from the New York Legislature and maps it to the
 * internal 'Legislation' type
 * @param bill A New York Legislature Bill object
 * @param API_KEY A NY OpenLegislation API Key
 * @returns A Legislation Object
 */
export const fetchBill = async (billId: string, API_KEY: string) => {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    view: 'default',
  });

  const billParts = billId.split('-');
  const url = `${BASE_URL}/bills/${billParts.pop()}/${billParts.pop()}?${searchParams.toString()}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) throw new Error('Failed to fetch NY legislation');
  if (!data.result) throw new Error('Unexpected response format');

  return mapToLegislation(data.result);
};

/**
 * Fetches the latest bill data from the New York Legislature for an array of
 * bills and maps them to the internal 'Legislation' type
 * @param billList An array of bill ids (e.g., 'S8451-2025')
 * @param API_KEY A New York OpenLegislation API Key
 * @returns An array of Legislation Objects
 */
export const fetchBills = async (billList: string[], API_KEY: string) => {
  return await Promise.all(billList.map((bill) => fetchBill(bill, API_KEY)));
};
