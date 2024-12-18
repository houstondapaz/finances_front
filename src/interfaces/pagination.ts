import { AxiosHeaders } from "axios"

export type SortDirection = 'ASC' | 'DESC'

export interface Sorting {
    property: string
    direction: SortDirection
}

export enum FilterOperator {
    EQUALS = 'eq',
    NOT_EQUALS = 'neq',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUALS = 'gte',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUALS = 'lte',
    LIKE = 'like',
    NOT_LIKE = 'nlike',
    IN = 'in',
    NOT_IN = 'nin',
    IS_NULL = 'isnull',
    IS_NOT_NULL = 'isnotnull',
}


export interface QueryFilter {
    property: string
    operator: FilterOperator
    value?: string
}
export interface ApiPagination {
    page: number
    limit: number
    filters?: QueryFilter[]
    sort?: Sorting
}

export interface Filter {
    pagination: {
        /**
         * Column name (from column definition)
         */
        sortBy: string;
        /**
         * Is sorting in descending order?
         */
        descending: boolean;
        /**
         * Page number (1-based)
         */
        page: number;
        /**
         * How many rows per page? 0 means Infinite
         */
        rowsPerPage: number;
    };
    /**
     * String/Object to filter table with (the 'filter' prop)
     */
    filter?: string | any
}

export function filterToApiPagination(filter?: Filter): ApiPagination {
    const apiPagination: ApiPagination = {
        page: filter?.pagination?.page || 1,
        limit: filter?.pagination?.rowsPerPage || 50,
        ...(filter?.pagination?.sortBy?.length ? {
            sort: {
                property: filter?.pagination.sortBy,
                direction: filter?.pagination.descending ? 'DESC' : 'ASC'
            }
        } : {})
    }
    return apiPagination
}

export function getPaginationHeadersProperties(headers: AxiosHeaders) {
    const total = Number.parseInt(headers.get('X-Total')?.toString() || '1')
    const pages = Number.parseInt(headers.get('X-Pages')?.toString() || '1')

    return { total, pages }
}