import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";
import {useSavedObject} from "@dhis2/app-service-datastore"
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {generateNewConfig} from "../utils";
import {useState} from "react";
import {useAlert} from "@dhis2/app-runtime";
import i18n from '@dhis2/d2-i18n'

export function useDisaggregationConfig(programIndicator: ProgramIndicator): {
    save: (disaggregationConfig: DisaggregationConfig) => void,
    saving: boolean,
    config: ProgramIndicatorTemplate
} {
    const [config, {replace}] = useSavedObject(programIndicator.id);
    const [saving, setSaving] = useState(false);
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const save = async (disaggregationConfig: DisaggregationConfig) => {
        try {
            if (config) {
                setSaving(true)
                const configs = config.disaggregationConfigs ?? [];
                const index = configs.findIndex((config: DisaggregationConfig) => config.id === disaggregationConfig.id);
                if (index === -1) {
                    configs.push(disaggregationConfig);
                } else {
                    configs[index] = disaggregationConfig;
                }
                await replace({...config, disaggregationConfigs: configs});
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
    return {
        save,
        saving,
        config
    }
}
