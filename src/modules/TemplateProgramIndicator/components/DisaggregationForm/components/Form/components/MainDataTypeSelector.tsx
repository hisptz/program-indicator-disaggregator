import {ProgramIndicator} from "../../../../../../../shared/interfaces/metadata";
import {useFormContext, useWatch} from "react-hook-form";
import {DATA_TYPES, PROGRAM_TYPES} from "../../../../../../../shared/constants";
import React, {useEffect} from "react";
import classes from "../../../DisaggregationForm.module.css";
import i18n from "@dhis2/d2-i18n";
import CustomRadioField from "../../../../../../../shared/components/InputFields/RadioField";
import {DataTypeSelector} from "./DataTypeSelector";

export function MainDataTypeSelector({pi}: { pi: ProgramIndicator }) {
    const dataType = useWatch({name: "dataType"});
    const {setValue, getFieldState} = useFormContext();
    const dataTypeFieldState = getFieldState("dataType");
    const isEventProgram = pi.program.programType === PROGRAM_TYPES.WITHOUT_REGISTRATION;

    //Clear data value on data type change
    useEffect(() => {
        if (dataTypeFieldState.isDirty) {
            setValue("data", "");
            if (dataType === DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE) {
                setValue("programStage", "");
            }
        }
    }, [dataType, dataTypeFieldState.isDirty, setValue]);

    //Auto assign data element for event programs
    useEffect(() => {
        if (isEventProgram) {
            setValue("dataType", DATA_TYPES.DATA_ELEMENT);
        }
    }, [isEventProgram, pi.program.programType, setValue]);

    return <div className={classes["form-group"]}>
        <label>{i18n.t("Disaggregate by")}</label>
        <div className="row-gap-16">
            <div className="col-sm-6">
                <CustomRadioField name="dataType" radioValue={DATA_TYPES.DATA_ELEMENT}
                                  dataTest="data-element-radio-option"
                                  label={i18n.t("Data element")}/>
            </div>
            <div className="col-sm-6">
                <CustomRadioField disabled={isEventProgram} name="dataType"
                                  radioValue={DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE}
                                  dataTest="attribute-radio-option"
                                  label={i18n.t("Attribute")}/>
            </div>
        </div>
        <DataTypeSelector pi={pi}/>
    </div>;
}
