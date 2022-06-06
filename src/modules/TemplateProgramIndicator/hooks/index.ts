import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";
import {useSavedObject} from "@dhis2/app-service-datastore"
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {saveConfig} from "../utils";
import {useState} from "react";
import {useAlert} from "@dhis2/app-runtime";

export function useDisaggregationConfig(programIndicator: ProgramIndicator): {
    save: (disaggregationConfig: DisaggregationConfig) => void,
    saving: boolean,
    config: ProgramIndicatorTemplate
} {
    const [config, {replace}] = useSavedObject(programIndicator.id);
    const [saving, setSaving] = useState(false);
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const save = async (disaggregationConfig: DisaggregationConfig) => {
        await saveConfig({config, disaggregationConfig, programIndicator}, {replace, show, setSaving});
    }
    return {
        save,
        saving,
        config
    }
}
