export interface GoogleGeocodingResponse {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
  geometry: {
    bounds: {};
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {};
  };
  navigation_points: [];
  place_id: string;
  types: string[];
}
