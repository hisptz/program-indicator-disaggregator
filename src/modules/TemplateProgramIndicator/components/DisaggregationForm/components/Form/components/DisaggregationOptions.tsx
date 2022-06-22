import {ProgramIndicator} from "../../../../../../../shared/interfaces/metadata";
import {useFormContext, useWatch} from "react-hook-form";
import {getSelectedData} from "../utils";
import {
    DISAGGREGATION_TYPES,
    DISAGGREGATION_TYPES_OPTIONS,
    SUPPORTED_VALUE_TYPES
} from "../../../../../../../shared/constants";
import React, {useEffect, useMemo} from "react";
import classes from "../../../DisaggregationForm.module.css";
import i18n from "@dhis2/d2-i18n";
import CustomSingleSelectField from "../../../../../../../shared/components/InputFields/SingleSelectField";
import {OptionSetDisaggregationType} from "./OptionSetDisaggregationType";
import {CustomValueDisaggregationType} from "./CustomValueDisaggregationType";

export function DisaggregationOptions({pi}: { pi: ProgramIndicator }): React.ReactElement | null {
    const [data, dataType] = useWatch({name: ["data", "dataType"]});
    const {setValue, getFieldState} = useFormContext();
    const dataFieldState = getFieldState("data");
    const dataSelected = getSelectedData(pi, data, dataType);
    const disaggregationOptions = DISAGGREGATION_TYPES_OPTIONS.filter(option => {
        if (dataSelected?.optionSet) {
            return option.value === DISAGGREGATION_TYPES.OPTION_SET;
        }
        if (SUPPORTED_VALUE_TYPES.includes(dataSelected?.valueType ?? '')) {
            return option.value === DISAGGREGATION_TYPES.CUSTOM_VALUE;
        }
        return false;
    });
    const options = useMemo(() => dataSelected?.optionSet?.options?.map(option => ({
        label: option.displayName ?? "",
        value: option.code
    })) ?? [], [dataSelected]);

    useEffect(() => {
        if (disaggregationOptions.length === 1) {
            setValue("type", disaggregationOptions[0].value);
        }
    }, [disaggregationOptions, setValue]);

    useEffect(() => {
        if (dataFieldState.isDirty) {
            setValue("values", []);
        }
    }, [data, dataFieldState.isDirty, options, setValue]); //DO NOT ADD VALUES TO THIS EFFECT!!!


    return data ? <div className={classes["form-group"]}>
        <label>{i18n.t("Disaggregation options")}</label>
        <div className="row-gap-16">
            <div className="col gap-16 col-sm-12">
                <CustomSingleSelectField
                    required
                    validations={{required: `${i18n.t("Disaggregation type is required")}`}}
                    disabled={options.length > 0} options={disaggregationOptions} name="type"
                    label={i18n.t("Disaggregation type")}
                />
            </div>
        </div>
        <div className="row-gap-16">
            <OptionSetDisaggregationType options={options}/>
        </div>
        <div className="row-gap-16">
            <CustomValueDisaggregationType valueType={dataSelected?.valueType ?? "TEXT"}/>
        </div>

    </div> : null;
}
