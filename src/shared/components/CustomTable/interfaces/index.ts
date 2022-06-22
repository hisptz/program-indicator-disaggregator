export interface Column {
    label: string;
    key: string;
    mapperFn?: (value: any) => any;
}


export interface Pagination {
    page: number;
    pageSize?: number;
    pageCount?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    disabled?: boolean;
    isLastPage?: boolean;
    nextPageText?: string | (() => string);
    previousPageText?: string | (() => string);
    pageSummaryText?: string | (() => string);
    hidePageSizeSelect?: boolean;
    hidePageSummary?: boolean;
    hidePageSelect?: boolean;
    pageSizes?: string[];
    total: number;
}


export interface CustomTableProps {
    columns: Column[],
    loading?: boolean;
    data: Record<string, any>[],
    onRowClick?: (row: any) => void
    pagination?: Pagination;
    selectedRows?: number[];
    suppressZebraStripping?: boolean;
}
