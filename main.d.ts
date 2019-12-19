// <reference types="express" />

export declare function FieldsFilter(data: any, req: Request): object;
export declare function ReqFilter(data: any, req: Request): object;
export declare function SortBy(data: any, req: Request): object;
export declare function UserInfo(data: any, req: Request): UserInfoPayload;

export interface Paginated<T> {
  readonly count: number;
  readonly pages: number;
  readonly currentPage: number;
  readonly limit: number;
  readonly data: T;
}

export interface PaginationOption {
  page: number;
  limit: number;
  skip: number;
}

export interface UserInfoPayload {
  data: {
    id: string;
    role: Array<string>;
    name: string;
    rt: number;
    rw: number;
    iat: number;
    exp: number;
    providerID?: string;
    providerType?: string;
    apartmentID?: string;
    apartmentName?: string;
    path?: string;
    deviceID?: string;
  };
  token: string;
}
