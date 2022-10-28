import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";
import i18n from "@dhis2/d2-i18n";
import {uploadGeneratedProgramIndicators} from "../../../shared/utils";
import {find, isEmpty} from "lodash";
import {asyncify, map, reduce} from "async";


interface SaveConfigCallbacks {
    replace: (config: ProgramIndicatorTemplate) => Promise<void>,
    addConfig: (id: string, config: ProgramIndicatorTemplate) => Promise<void>,
    show: (props?: any) => void,
    setSaving: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setUploading: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setProgress: (value: (((prevState: number) => number))) => void
}


export function generateNewConfig(pi: ProgramIndicator, disaggregationConfig: DisaggregationConfig): ProgramIndicatorTemplate {
    return {
        id: pi.id,
        disaggregationConfigs: [disaggregationConfig],
        programIndicator: {
            id: pi.id
        }
    }
}


const updateCheckQuery = {
    check: {
        resource: "programIndicators",
        params: ({ids, lastUpdated}: any) => ({
            fields: ["id", "lastUpdated"],
            filter: [`id:in:[${ids.join(',')}]`, `lastUpdated:lt:${lastUpdated}`],
        })
    }
}

export async function checkUpdateStatus(engine: any, config: DisaggregationConfig, template: ProgramIndicator): Promise<boolean> {
    const indicatorIds = config.indicators.map(indicator => indicator.id);
    const lastUpdated = template.lastUpdated;

    const response = await engine.query(updateCheckQuery, {
        variables: {
            ids: indicatorIds,
            lastUpdated
        }
    });

    return response?.check.programIndicators?.length > 0 ?? false;

}


const programIndicatorsQuery = {
    pi: {
        resource: "programIndicators",
        params: ({ids}: any) => ({
            filter: `id:in:[${ids.join(',')}]`,
            fields: [
                "id",
                "name",
                "shortName",
                "displayName",
                "description",
                "aggregationType",
                "displayInForm",
                "publicAccess",
                "displayDescription",
                "displayShortName",
                "displayFormName",
                "filter",
                "analyticsType",
                "favorite",
                "dimensionItemType",
                "access",
                "sharing",
                "favorites",
                "programIndicatorGroups[id]",
                "analyticsPeriodBoundaries[access,analyticsPeriodBoundaryType,attributeValues,boundaryTarget,created,externalAccess,favorite,favorites,lastUpdated,sharing,translations,userAccesses,userGroupAccesses]",
                "userGroupAccesses",
                "attributeValues",
                "userAccesses",
                "legendSets[id]",
                "createdBy[id]",
                "lastUpdated",
                "lastUpdatedBy[id]",
                "expression",
                "program[id,programType,displayName,programStages[id,displayName,programStageDataElements[id,dataElement[id,displayName,valueType,optionSet[id,displayName,options[id,displayName,code]]]]],programTrackedEntityAttributes[id,displayName,trackedEntityAttribute[id,displayName,valueType,optionSet[id,displayName,options[id,displayName,code]]]]]",
            ]
        })
    }
}

async function getProgramIndicators(engine: any, programIndicators: { id: string }[]): Promise<ProgramIndicator[]> {
    const ids = programIndicators.map(({id}) => id);
    return (await engine.query(programIndicatorsQuery, {variables: {ids}}))?.pi?.programIndicators as ProgramIndicator[]
}

export async function saveCompoundConfig(engine: any, {
    allConfig,
    disaggregationConfig,
    originalConfig
}: { allConfig: ProgramIndicatorTemplate[], disaggregationConfig: DisaggregationConfig, originalConfig: DisaggregationConfig }, callbacks: SaveConfigCallbacks): Promise<boolean> {
    const {indicators} = originalConfig;
    const programIndicators = await getProgramIndicators(engine, indicators);
    if (!isEmpty(programIndicators)) {
        return await reduce(programIndicators, true, asyncify(async (acc: boolean, programIndicator: ProgramIndicator) => {
            const config = find(allConfig, ['id', programIndicator.id])
            return acc && await saveConfig(engine, {config, disaggregationConfig, programIndicator}, callbacks)
        }))
    }

    return false;

}

export async function saveConfig(engine: any, {
    config,
    disaggregationConfig,
    programIndicator
}: { config?: ProgramIndicatorTemplate, disaggregationConfig: DisaggregationConfig, programIndicator: ProgramIndicator }, {
                                     replace,
                                     addConfig,
                                     show,
                                     setSaving,
                                     setProgress,
                                     setUploading
                                 }: SaveConfigCallbacks): Promise<boolean> {
    try {
        setUploading(true);
        const uploadedIndicators = await uploadGeneratedProgramIndicators(engine, {
            programIndicator,
            disaggregationConfig
        }, {setProgress});
        setUploading(false);
        if (config) {
            if (!isEmpty(uploadedIndicators)) {
                show({
                    message: i18n.t("Successfully uploaded {{ no }} indicators", {no: uploadedIndicators.length}),
                    type: {success: true}
                })
                setSaving(true);
                const configs = config.disaggregationConfigs ?? [];
                const index = configs?.findIndex((config: DisaggregationConfig) => config.id === disaggregationConfig.id);

                const updatedDisaggregationConfig = {
                    ...disaggregationConfig,
                    indicators: uploadedIndicators
                };

                if (index === -1) {
                    configs.push(updatedDisaggregationConfig);
                } else {
                    configs[index] = updatedDisaggregationConfig;
                }
                await replace({...config, disaggregationConfigs: configs});
                show({
                    message: i18n.t("Configuration updated successfully"),
                    type: {success: true}
                })
                return true;
            }
            return false;
        } else {
            const updatedDisaggregationConfig = {
                ...disaggregationConfig,
                indicators: uploadedIndicators
            };
            const newConfig = generateNewConfig(programIndicator, disaggregationConfig);
            await addConfig(newConfig.id, {...newConfig, disaggregationConfigs: [updatedDisaggregationConfig]});
            show({
                message: i18n.t("Configuration saved successfully"),
                type: {success: true}
            })
            return true;
        }
    } catch (e) {
        show({
            message: i18n.t("Error saving configuration"),
            type: {info: true}
        })
        return false;
    } finally {
        setSaving(false);
        setUploading(false);
    }
}
