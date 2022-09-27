import {ProgramIndicator} from "../../../../../../../shared/interfaces/metadata";
import {useWatch} from "react-hook-form";
import {DATA_TYPES, SUPPORTED_VALUE_TYPES,VARIABLE_CONST} from "../../../../../../../shared/constants";
import CustomSingleSelectField from "../../../../../../../shared/components/InputFields/SingleSelectField";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import { DisaggregationConfig } from "../../../../../../../shared/interfaces";

export function DataTypeSelector({pi, config}: { pi: ProgramIndicator, config?: DisaggregationConfig }): React.ReactElement {
    const dataType = useWatch({name: "dataType"});
    const programStages = pi.program.programStages?.map(ps => ({label: ps.displayName ?? '', value: ps.id}));
    const programVariable = VARIABLE_CONST.map(pv => ({label: pv.displayName, value: pv.id, type: pv.valueType})).filter(constant => {
        if(!config){
            return true;
        }
        if(config.dataType !== DATA_TYPES.VARIABLE){
            return true;
        }
        return constant.value !== config.data;
    });
    const attributes = pi.program.programTrackedEntityAttributes?.filter((attribute) => SUPPORTED_VALUE_TYPES.includes(attribute?.trackedEntityAttribute?.valueType ?? "")).map(pta => ({
        label: pta.trackedEntityAttribute.displayName ?? '',
        value: pta.trackedEntityAttribute.id
    })).filter(attribute => {
        if (!config){
            return true;
        }
        if(config.dataType !== DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE){
            return true;
        }
        return attribute.value !== config.data;
    }) ?? [];

    const selectedProgramStage = useWatch({name: "programStage"});

    const dataElements = pi.program.programStages?.find(ps => ps.id === selectedProgramStage)?.programStageDataElements?.filter((dataElement) => SUPPORTED_VALUE_TYPES.includes(dataElement.dataElement.valueType)).map(psde => ({
        label: psde.dataElement.displayName ?? '',
        value: psde.dataElement.id
    })).filter(dataElement => {
        if (!config){
            return true;
        }
        if(config.dataType !== DATA_TYPES.DATA_ELEMENT){
            return true;
        }
        return dataElement.value !== config.data;
    }) ?? [];
    return <div className="row-gap-16">
        {
            dataType === DATA_TYPES.DATA_ELEMENT && <>
                <div className="col-sm-6">
                    <CustomSingleSelectField required validations={{required: `${i18n.t("Program stage is required")}`}}
                                             options={programStages ?? []} name="programStage"
                                             label={i18n.t("Program stage")}/>
                </div>
                <div className="col-sm-6">
                    <CustomSingleSelectField
                        required
                        validations={{
                            required: `${i18n.t("Data element is required")}`,
                        }}
                        disabled={!selectedProgramStage}
                        options={dataElements} name="data"
                        label={i18n.t("Data Element")}/>
                </div>
            </>
        }
        {
            dataType === DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE && <>
                <div className="col-sm-12">
                    <CustomSingleSelectField
                        required
                        validations={{required: `${i18n.t("Attribute is required")}`}}
                        options={attributes} name="data" label={i18n.t("Attribute")}
                    />
                </div>
            </>
        }
        {
            dataType === DATA_TYPES.VARIABLE && <>
                <div className="col-sm-12">
                    <CustomSingleSelectField
                        required
                        validations={{required: `${i18n.t("Variable is required")}`}}
                        options={programVariable} name="data" label={i18n.t("Variable")}
                    />
                </div>
            </>
        }
    </div>;
}
