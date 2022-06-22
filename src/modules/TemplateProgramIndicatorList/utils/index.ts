import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {DisaggregationConfig} from "../../../shared/interfaces";
import {find} from "lodash";

export function sanitizeProgramIndicators(configurations: DisaggregationConfig[], programIndicators: ProgramIndicator[]): any {

    return programIndicators?.map((programIndicator) => {
        const generic = find(configurations, {programIndicator: {id: programIndicator.id}});
        if (generic) {
            return {
                ...programIndicator,
                disaggregated: true
            }
        } else {
            return programIndicator;
        }
    })
}
