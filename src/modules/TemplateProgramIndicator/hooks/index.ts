import {DisaggregationConfig, ProgramIndicatorTemplate} from "../../../shared/interfaces";
import {useSavedObject, useSavedObjectList} from "@dhis2/app-service-datastore"
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {saveCompoundConfig, saveConfig} from "../utils";
import {useState} from "react";
import {useAlert, useDataEngine} from "@dhis2/app-runtime";
import {useParams} from "react-router-dom";

export function useManageProgramIndicatorTemplate(programIndicator: ProgramIndicator): {
    save: (disaggregationConfig: DisaggregationConfig) => Promise<boolean>,
    saveCompoundDisaggregations: (disaggregationConfig: DisaggregationConfig, originalDisaggregation: DisaggregationConfig) => Promise<boolean>,
    saving: boolean,
    config: ProgramIndicatorTemplate,
    progress: number,
    uploading: boolean
    count: number
} {
    const [config, {replace}] = useSavedObject(programIndicator?.id, {global: true});
    const [allConfigs, {update: addConfig}] = useSavedObjectList({global: true})
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
            addConfig,
            show,
            setSaving,
            setProgress,
            setUploading
        });
    }

    const saveCompoundDisaggregations = async (disaggregationConfig: DisaggregationConfig, originalDisaggregation: DisaggregationConfig): Promise<boolean> => {
        setCount((disaggregationConfig?.values?.length ?? 0) * (originalDisaggregation?.indicators?.length ?? 0))
        if (originalDisaggregation) {
            return await saveCompoundConfig(engine, {
                allConfig: allConfigs,
                disaggregationConfig,
                originalConfig: originalDisaggregation
            }, {
                replace,
                addConfig,
                show,
                setSaving,
                setProgress,
                setUploading
            })
        }
        return false;
    }
    return {
        save,
        saveCompoundDisaggregations,
        saving,
        uploading,
        config,
        progress,
        count
    }
}


export function useProgramIndicatorTemplate(): ProgramIndicatorTemplate {
    const {id} = useParams();
    const [config] = useSavedObject(id, {global: true, ignoreUpdates: false});
    return config;
}
