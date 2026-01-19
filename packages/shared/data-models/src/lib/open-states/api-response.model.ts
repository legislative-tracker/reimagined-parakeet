export type SingletonResponse<T> = T;

export type PaginatedResponse<T> = {
  results: T[];
  pagination: {
    per_page: number;
    page: number;
    max_page: number;
    total_items: number;
  };
};

export type ErrorResponse = {
  detail:
    | string
    | {
        loc: [];
        msg: string;
        type: string;
        ctx?: {
          enum_values: string[];
        };
      }[];
};

export type ApiResponse<T> =
  | SingletonResponse<T>
  | PaginatedResponse<T>
  | ErrorResponse;
