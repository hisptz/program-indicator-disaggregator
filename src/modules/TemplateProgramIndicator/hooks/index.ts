import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";
import {useSavedObject} from "@dhis2/app-service-datastore"
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {saveConfig} from "../utils";
import {useState} from "react";
import {useAlert, useDataEngine} from "@dhis2/app-runtime";

export function useDisaggregationConfig(programIndicator: ProgramIndicator): {
    save: (disaggregationConfig: DisaggregationConfig) => Promise<boolean>,
    saving: boolean,
    config: ProgramIndicatorTemplate,
    progress: number,
    uploading: boolean
    count: number
} {
    const [config, {replace}] = useSavedObject(programIndicator?.id, {global: true});
    const engine = useDataEngine();
    const [saving, setSaving] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const save = async (disaggregationConfig: DisaggregationConfig): Promise<boolean> => {
        setCount(disaggregationConfig.values.length);
        return await saveConfig(engine, {config, disaggregationConfig, programIndicator}, {
            replace,
            show,
            setSaving,
            setProgress,
            setUploading
        });
    }

    return {
        save,
        saving,
        uploading,
        config,
        progress,
        count
    }
}
