import {DateTime} from "luxon";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {uid} from "@hisptz/dhis2-utils";
import {DisaggregationConfig} from "../interfaces";
import {DATA_TYPES, PROGRAM_INDICATOR_MUTATION} from "../constants";
import {compact, isEmpty} from "lodash";
import {asyncify, mapSeries} from "async"

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

export function generatePIConfigurationFromDisaggregationConfig(template: ProgramIndicator, disaggregationConfig: DisaggregationConfig): { value: string, indicator: ProgramIndicator }[] {
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
            value,
            indicator: {
                ...template,
                id: uid(),
                name,
                program: {
                    id: template.program.id
                },
                displayName: `${template.displayName} ${name}`,
                shortName: `${template.shortName} ${name}`,
                displayShortName: `${template.displayShortName} ${name}`,
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
