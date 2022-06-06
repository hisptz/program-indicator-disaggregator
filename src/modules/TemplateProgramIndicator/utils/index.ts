import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";

export function generateNewConfig(pi: ProgramIndicator, disaggregationConfig: DisaggregationConfig): ProgramIndicatorTemplate {
    return {
        id: pi.id,
        disaggregationConfigs: [disaggregationConfig],
        programIndicator: {
            id: pi.id
        }
    }
}
