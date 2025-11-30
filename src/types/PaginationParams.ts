// src/types/pagination.ts
export type PaginationParams = {
  page?: number;
  size?: number;
  sortBy?: SortField;
  direction?: SortDirection;
};

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortField {
  CREATED_AT = 'createdAt',
  ID = 'id',
}
