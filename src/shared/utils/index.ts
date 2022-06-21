import {DateTime} from "luxon";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {uid} from "@hisptz/dhis2-utils";
import {DisaggregationConfig} from "../interfaces";
import {DATA_TYPES, PROGRAM_INDICATOR_MUTATION} from "../constants";
import {compact, isEmpty, reduce} from "lodash";
import {asyncify, mapSeries} from "async"

export const getSanitizedDateString = (date: string): string => {
    try {
        const dateTime = DateTime.fromISO(date);
        return dateTime.toLocaleString(DateTime.DATE_FULL);
    } catch (error) {
        return "N/A";
    }
};


export function validateNameLength(data: DisaggregationConfig, pi: ProgramIndicator): { valid: boolean, valueWithExtraChars: string } {
    const originalShortName = pi.shortName;
    let valueWithExtraChars = '';
    const valid = reduce(data.values, (acc, value) => {
        const valid = acc && `${originalShortName} ${value}`.length <= 50;
        if (!valid) {
            valueWithExtraChars = `${value}`;
        }
        return valid;
    }, true);

    return {valid, valueWithExtraChars};
}


function generateFilter(disaggregationConfig: DisaggregationConfig, value: string): string {
    if (disaggregationConfig.dataType === DATA_TYPES.DATA_ELEMENT) {
        return `#{${disaggregationConfig.programStage}.${disaggregationConfig.data}} == "${value}"`;
    }
    if (disaggregationConfig.dataType === DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE) {
        return `A{${disaggregationConfig.data}} == "${value}"`;
    }
    return "";
}

export function generatePIConfigurationFromDisaggregationConfig(template: ProgramIndicator, disaggregationConfig: DisaggregationConfig): { value: string, indicator: ProgramIndicator }[] {
    const {values} = disaggregationConfig;
    return values.map(value => {
        const prefix = disaggregationConfig.nameTemplate.replace(/({{ disaggregationValue }})|({{disaggregationValue}})/, value);

        let filter = template.filter;

        if (filter) {
            filter = `${filter} && ${generateFilter(disaggregationConfig, value)}`
        } else {
            filter = generateFilter(disaggregationConfig, value);
        }

        return {
            value,
            indicator: {
                ...template,
                id: uid(),
                name: `${template.name} ${prefix}`,
                program: {
                    id: template.program.id
                },
                displayName: `${template.displayName} ${prefix}`,
                shortName: `${template.shortName} ${prefix}`,
                displayShortName: `${template.displayShortName} ${prefix}`,
                filter
            }
        }
    });
}

export async function uploadGeneratedProgramIndicators(engine: any, {programIndicator, disaggregationConfig}: {
    programIndicator: ProgramIndicator,
    disaggregationConfig: DisaggregationConfig
}, {setProgress}: {
    setProgress:
        (setter: (prevState: number) => number) => void
}): Promise<Array<{ id: string; value: string }>> {
    const indicators = generatePIConfigurationFromDisaggregationConfig(programIndicator, disaggregationConfig);

    if (isEmpty(indicators)) {
        return [];
    }

    const responses = await mapSeries(indicators, asyncify(async (indicator: { value: string, indicator: ProgramIndicator }) => await uploadProgramIndicator(engine, indicator).then((value) => {
        setProgress(prevState => prevState + 1);
        return value;
    })) as () => Promise<{ id: string }>);

    return compact(responses) as Array<{ id: string; value: string }>;
}

export async function uploadProgramIndicator(engine: any, {
    value,
    indicator
}: { value: string, indicator: ProgramIndicator }): Promise<{ id: string, value: string } | undefined> {
    try {
        const uploadResponse = await engine.mutate(PROGRAM_INDICATOR_MUTATION, {variables: {data: indicator}});
        if (isEmpty(uploadResponse?.response?.errorReports)) {
            return {id: uploadResponse?.response?.uid, value};
        }
        return;
    } catch (e) {
        return;
    }
}


export function getIndicatorUrl(baseUrl: string, id: string): string {
    return `${baseUrl}/dhis-web-maintenance/index.html#/edit/indicatorSection/programIndicator/${id}`;
}
