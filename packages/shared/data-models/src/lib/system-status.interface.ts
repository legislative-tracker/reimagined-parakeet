/**
 * DTO (Data Transfer Object) for the System Status response.
 * This defines what the backend tells the frontend about its capabilities.
 */
export interface SystemStatusResponse {
  /**
   * List of enabled legislature codes (e.g., ['us-ny', 'us-ca']).
   * The frontend uses this to render the map and validate routes.
   */
  enabledLegislatures: string[];

  /**
   * The version of the backend service (useful for cache busting or debugging).
   */
  version: string;
}
