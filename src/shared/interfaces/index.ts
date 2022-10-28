import {DATA_TYPES, DISAGGREGATION_TYPES} from "../constants";


export interface DisaggregationValue {
    value: string,
    name: string,
    operator?: string,
    valueType?: string,
}

export interface DisaggregationIndicatorConfig {
    id: string,
    value: string
}

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
    values: Array<DisaggregationValue>,
    indicators: DisaggregationIndicatorConfig[],
}

export interface ProgramIndicatorTemplate {
    id: string;
    programIndicator: {
        id: string,
    },
    disaggregationConfigs: Array<DisaggregationConfig>
}
