import {ProgramIndicator} from "../../../shared/interfaces/metadata";

export const onPageChange = (newPage: number, refetch: any): void => {
    refetch({page: newPage});
};
export const onPageSizeChange = (newPageSize: number, refetch: any): void => {
    refetch({pageSize: newPageSize});
};
export const onSearchIndicators = (searchValue: string, refetch: any): void => {
    refetch({identifiable: searchValue});
};
export const onOpenIndicatorTemplate = (navigate: any) => (indicator: ProgramIndicator): void => {
    navigate(`/pi/${indicator.id}`)
};


export const onFilterIndicator = (program: string, refetch: any): void => {
    refetch({program: program});
}
