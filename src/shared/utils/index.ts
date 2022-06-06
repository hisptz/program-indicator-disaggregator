import {DateTime} from "luxon";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {uid} from "@hisptz/dhis2-utils";
import {DisaggregationConfig} from "../interfaces";
import {DATA_TYPES} from "../constants";

export const getSanitizedDateString = (date: string): string => {
    try {
        const dateTime = DateTime.fromISO(date);
        return dateTime.toLocaleString(DateTime.DATE_FULL);
    } catch (error) {
        return "N/A";
    }
};

function generateFilter(disaggregationConfig: DisaggregationConfig, value: string): string {
    if (disaggregationConfig.dataType === DATA_TYPES.DATA_ELEMENT) {
        return `#{${disaggregationConfig.programStage}.${disaggregationConfig.data}} == "${value}"`;
    }
    if (disaggregationConfig.dataType === DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE) {
        return `A{${disaggregationConfig.data}} == "${value}"`;
    }
    return "";
}

export function generatePIConfigurationFromDisaggregationConfig(template: ProgramIndicator, disaggregationConfig: DisaggregationConfig): ProgramIndicator[] {
    const {values} = disaggregationConfig;
    return values.map(value => {
        const name = disaggregationConfig.nameTemplate.replace("{{ disaggregationValue }}", value);

        let filter = template.filter;

        if (filter) {
            filter = `${filter} && ${generateFilter(disaggregationConfig, value)}`
        } else {
            filter = generateFilter(disaggregationConfig, value);
        }

        return {
            ...template,
            id: uid(),
            name,
            program: {
                id: template.program.id
            },
            displayName: name,
            shortName: name,
            displayShortName: name,
            filter
        }
    });
}
