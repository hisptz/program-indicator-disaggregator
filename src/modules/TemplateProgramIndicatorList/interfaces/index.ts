import {ProgramIndicator} from "../../../shared/interfaces/metadata";
import {Pagination} from "../../../shared/interfaces/pagination";

export interface QueryData {
    programIndicators?: ProgramIndicator[];
    pager?: Pagination;
}
