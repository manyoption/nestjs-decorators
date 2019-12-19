import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";

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

export const Pagination = createParamDecorator((defaultPerPage: number, req: Request) => {
  let { page, limit } = req.query;
  let skip = 0;
  if (isNaN(parseInt(limit))) {
    limit = isNaN(defaultPerPage) ? 10 : defaultPerPage;
  } else {
    limit = parseInt(limit);
  }
  if (!isNaN(parseInt(page))) {
    skip = (parseInt(page) - 1) * parseInt(limit);
  }
  page = isNaN(parseInt(page)) ? 1 : parseInt(page);
  return {
    page,
    limit,
    skip
  };
});

// Decorator to filter the requested fields
// valid request must be in form if ?fields=fieldA,fieldB...
// of if the fields name that wnt to excluded must be prepend with -
// ?fields=-fieldA,-fieldB
export const FieldsFilter = createParamDecorator((returnType, req: Request): {} | string[] => {
  let fields = <string>req.query.fields;
  let requestedFields = returnType === "array" ? [] : {};
  if (fields !== undefined) {
    let arrayOfFields = fields.replace(/^[^a-z\-]+|\s+|[^a-z]+$/gi, "").split(",");
    // only use non empty fields
    arrayOfFields = arrayOfFields.filter(field => field !== "");
    if (Array.isArray(requestedFields)) {
      return arrayOfFields;
    }
    // only allow a-z commas and space in fields value
    arrayOfFields.forEach(field => {
      // if the field name is prepended with minus (-) sign
      // than it means this field is excluded in return data
      if (field.match(/-[a-z]+/gi)) {
        let stripedFieldname = field.replace(/-/, "");
        // in mongodb, to exclude the field(s) we use {<fieldname>:0}
        requestedFields[stripedFieldname] = 0;
      } else {
        // otherwise include it using {<fieldname>:1}
        requestedFields[field] = 1;
      }
    });
    return requestedFields;
  }
  return requestedFields;
});

// filter must be in form ?filter=<fieldname>:<fieldValue>,[<fieldname>:<fieldvalue>]
export const ReqFilter = createParamDecorator((_, req: Request): object => {
  let filter = <string>req.query.filter;
  if (filter !== undefined) {
    // only allow a-z commas and space in filter value
    if (filter.match(/[a-z,\:\-\s+0-9]+/gi)) {
      let filters = filter.split(",");
      let filterObject = {};
      filters.forEach(f => {
        let [field, value] = f.split(":");
        if (value !== undefined || value !== "") {
          filterObject[field] = value;
        }
      });
      return filterObject;
    }
  }
  return {};
});

export const SortBy = createParamDecorator((_, req: Request): object => {
  let { sort } = req.query;
  if (sort !== undefined) {
    if (sort.match(/[a-z0-9\-]+/gi)) {
      let [field, value] = sort.split(":");
      if (value.match(/-.[0-9]+/g)) {
        value = parseInt(value);
      }
      return { [field]: value };
    }
  }
  return { _id: -1 };
});

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

export const UserInfo = createParamDecorator(
  (_, req: Request): UserInfoPayload => {
    let user = <UserInfoPayload>req["user"];
    return user;
  }
);
