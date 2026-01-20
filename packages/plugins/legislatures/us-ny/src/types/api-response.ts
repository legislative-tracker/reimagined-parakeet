import type { Items } from './common.js';

export type APIBaseResponse = {
  success: boolean;
  message: string;
  responseType: string;
};

export interface APIResponseSuccess<T> extends APIBaseResponse {
  success: true;
  total?: number;
  offsetStart?: number;
  offsetEnd?: number;
  limit?: number;
  result: T | Items<T>;
}

export interface APIResponseError extends APIBaseResponse {
  success: false;
  errorCode: number;
  errorData?: {
    [key: string]: string | number;
  };
  errorDataType?: string;
}

export type APIResponse<T> = APIResponseSuccess<T> | APIResponseError;
