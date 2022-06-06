import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";
import i18n from "@dhis2/d2-i18n";
import {generatePIConfigurationFromDisaggregationConfig} from "../../../shared/utils";

export function generateNewConfig(pi: ProgramIndicator, disaggregationConfig: DisaggregationConfig): ProgramIndicatorTemplate {
    return {
        id: pi.id,
        disaggregationConfigs: [disaggregationConfig],
        programIndicator: {
            id: pi.id
        }
    }
}

export async function saveConfig({
                                     config,
                                     disaggregationConfig,
                                     programIndicator
                                 }: { config: ProgramIndicatorTemplate, disaggregationConfig: DisaggregationConfig, programIndicator: ProgramIndicator }, {
                                     replace,
                                     show,
                                     setSaving
                                 }: { replace: (config: ProgramIndicatorTemplate) => Promise<void>, show: (props?: any) => void, setSaving: (value: (((prevState: boolean) => boolean) | boolean)) => void }): Promise<void> {
    try {
        if (config) {
            setSaving(true)
            const configs = config.disaggregationConfigs ?? [];
            const index = configs?.findIndex((config: DisaggregationConfig) => config.id === disaggregationConfig.id);

            const updatedDisaggregationConfig = {
                ...disaggregationConfig,
                indicators: generatePIConfigurationFromDisaggregationConfig(programIndicator, disaggregationConfig)
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
        } else {
            const newConfig = generateNewConfig(programIndicator, disaggregationConfig);
            await replace(newConfig);
            show({
                message: i18n.t("Configuration saved successfully"),
                type: {success: true}
            })
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        show({
            message: i18n.t("Error saving configuration"),
            type: {info: true}
        })
        console.error(e);
    } finally {
        setSaving(false)
    }
}
