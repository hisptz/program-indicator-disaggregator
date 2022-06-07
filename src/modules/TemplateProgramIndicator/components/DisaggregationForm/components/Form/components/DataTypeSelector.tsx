import {ProgramIndicator} from "../../../../../../../shared/interfaces/metadata";
import {useWatch} from "react-hook-form";
import {DATA_TYPES, SUPPORTED_VALUE_TYPES} from "../../../../../../../shared/constants";
import CustomSingleSelectField from "../../../../../../../shared/components/InputFields/SingleSelectField";
import i18n from "@dhis2/d2-i18n";
import React from "react";

export function DataTypeSelector({pi}: { pi: ProgramIndicator }): React.ReactElement {
    const dataType = useWatch({name: "dataType"});

    const programStages = pi.program.programStages?.map(ps => ({label: ps.displayName ?? '', value: ps.id}));
    const attributes = pi.program.programTrackedEntityAttributes?.filter((attribute) => SUPPORTED_VALUE_TYPES.includes(attribute?.trackedEntityAttribute?.valueType ?? "")).map(pta => ({
        label: pta.trackedEntityAttribute.displayName ?? '',
        value: pta.trackedEntityAttribute.id
    })) ?? [];

    const selectedProgramStage = useWatch({name: "programStage"});

    const dataElements = pi.program.programStages?.find(ps => ps.id === selectedProgramStage)?.programStageDataElements?.filter((dataElement) => SUPPORTED_VALUE_TYPES.includes(dataElement.dataElement.valueType)).map(psde => ({
        label: psde.dataElement.displayName ?? '',
        value: psde.dataElement.id
    })) ?? [];

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
    </div>;
}
