import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";
import i18n from "@dhis2/d2-i18n";
import {uploadGeneratedProgramIndicators} from "../../../shared/utils";
import {isEmpty} from "lodash";

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

export async function saveConfig(engine: any, {
    config,
    disaggregationConfig,
    programIndicator
}: { config: ProgramIndicatorTemplate, disaggregationConfig: DisaggregationConfig, programIndicator: ProgramIndicator }, {
                                     replace,
                                     show,
                                     setSaving,
                                     setProgress,
                                     setUploading
                                 }: { replace: (config: ProgramIndicatorTemplate) => Promise<void>, show: (props?: any) => void, setSaving: (value: (((prevState: boolean) => boolean) | boolean)) => void, setUploading: (value: (((prevState: boolean) => boolean) | boolean)) => void, setProgress: (value: (((prevState: number) => number))) => void }): Promise<boolean> {
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
            await replace({...newConfig, disaggregationConfigs: [updatedDisaggregationConfig]});
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
