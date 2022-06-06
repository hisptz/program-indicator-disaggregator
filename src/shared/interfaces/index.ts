import {DATA_TYPES, DISAGGREGATION_TYPES} from "../constants";


export interface DisaggregationConfig {
    id: string;
    programIndicator: {
        id: string
    };
    type: DISAGGREGATION_TYPES,
    dataType: DATA_TYPES;
    data: string;
    nameTemplate: string;
    programStage?: {
        id: string
    },
    values: Array<string>
}


export interface ProgramIndicatorTemplate {
    id: string;
    programIndicator: {
        id: string,
    },
    disaggregationConfigs: Array<DisaggregationConfig>
}