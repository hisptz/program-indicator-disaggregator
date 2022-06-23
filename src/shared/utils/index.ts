import {DateTime} from "luxon";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {uid} from "@hisptz/dhis2-utils";
import {DisaggregationConfig} from "../interfaces";
import {DATA_TYPES, PROGRAM_INDICATOR_MUTATION, PROGRAM_INDICATOR_UPDATE_MUTATION} from "../constants";
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


export function generateNamePrefix(value: { name: string; value: string; }, nameTemplate: string): string {
    return nameTemplate.replace(/({{ disaggregationValue }})|({{disaggregationValue}})/, value.name.toString());
}

export function validateNameLength(data: DisaggregationConfig, pi: ProgramIndicator): { valid: boolean, valuesWithExtraChars: string[] } {
    const originalShortName = pi.shortName;

    const valuesWithExtraChars: string[] = [];
    const valid = reduce(data.values, (acc, value) => {
        const prefix = generateNamePrefix(value, data.nameTemplate);
        const valid = acc && `${originalShortName} ${prefix}`.length <= 50;
        if (!valid) {
            valuesWithExtraChars.push(value.name);
        }
        return valid;
    }, true);

    return {valid, valuesWithExtraChars};
}


export async function updateIndicator(engine: any, {
    indicator: programIndicator,
    value
}: { indicator: ProgramIndicator, value: any }): Promise<{ id: string, value: any } | undefined> {
    const uploadResponse = await engine.mutate(PROGRAM_INDICATOR_UPDATE_MUTATION, {
        variables: {
            data: programIndicator,
            id: programIndicator.id
        }
    });
    if (isEmpty(uploadResponse?.response?.errorReports)) {
        return {id: uploadResponse?.response?.uid, value};
    }
}

export async function uploadUpdatedIndicators(engine: any, updatedIndicators: { value: any, indicator: ProgramIndicator }[]): Promise<{ value: any, indicator: ProgramIndicator }[]> {

    const responses = await mapSeries(updatedIndicators, asyncify(async (indicator: { indicator: ProgramIndicator, value: any }) => await updateIndicator(engine, indicator)));
    return compact(responses) as { value: any, indicator: ProgramIndicator }[];
}

export function generateProgramIndicatorUpdates(pi: ProgramIndicator, config: DisaggregationConfig): { value: any; indicator: ProgramIndicator }[] {
    const {indicators} = config;
    return indicators.map(indicator => {
        return generateProgramIndicator(pi, config, indicator);
    });
}


export async function updateIndicators(engine: any, template: ProgramIndicator, config: DisaggregationConfig) {
    const indicatorsToUpdate = generateProgramIndicatorUpdates(template, config);
    return await uploadUpdatedIndicators(engine, indicatorsToUpdate);
}

function generateFilter(disaggregationConfig: DisaggregationConfig, value: { name: string; value: any }): string {
    const filterValue = value.value;
    if (disaggregationConfig.dataType === DATA_TYPES.DATA_ELEMENT) {
        return `#{${disaggregationConfig.programStage}.${disaggregationConfig.data}} == "${filterValue}"`;
    }
    if (disaggregationConfig.dataType === DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE) {
        return `A{${disaggregationConfig.data}} == "${filterValue}"`;
    }
    return "";
}

function generateProgramIndicator(template: ProgramIndicator, config: DisaggregationConfig, {
    value,
    id
}: { value: any, id?: string }): { value: any, indicator: ProgramIndicator } {
    const {nameTemplate} = config;
    const prefix = generateNamePrefix(value, nameTemplate);
    let filter = template.filter;
    if (filter) {
        filter = `${filter} && ${generateFilter(config, value)}`
    } else {
        filter = generateFilter(config, value);
    }
    return {
        value,
        indicator: {
            ...template,
            id: id ?? uid(),
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
}

export function generatePIConfigurationFromDisaggregationConfig(template: ProgramIndicator, disaggregationConfig: DisaggregationConfig): { value: string, indicator: ProgramIndicator }[] {
    const {values} = disaggregationConfig;
    return values.map(value => {
        return generateProgramIndicator(template, disaggregationConfig, {value});
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
