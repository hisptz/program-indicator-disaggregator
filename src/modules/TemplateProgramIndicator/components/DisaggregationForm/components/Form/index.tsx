import React from 'react'
import {InputField} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import classes from "../../DisaggregationForm.module.css"
import CustomSingleSelectField from "../../../../../../shared/components/InputFields/SingleSelectField";
import CustomRadioField from "../../../../../../shared/components/InputFields/RadioField";
import {useWatch} from "react-hook-form";
import {DISAGGREGATION_TYPES, DISAGGREGATION_TYPES_OPTIONS} from "../../../../../../shared/constants";
import MultipleOptionsField from "../../../../../../shared/components/MultipleOptionsField";
import CustomValueField from "../../../../../../shared/components/CustomValueField";

function OptionSetDisaggregationType() {
    const type = useWatch({name: "type"});
    return type === DISAGGREGATION_TYPES.OPTION_SET ? <div className="col-sm-12">
        <MultipleOptionsField
            name="values"
            label={i18n.t("Select options")}
            options={[
                {label: i18n.t("Option 1"), value: "option1"},
                {label: i18n.t("Option 2"), value: "option2"},
            ]}
        />
    </div> : null;
}

function CustomValueDisaggregationType() {
    const type = useWatch({name: "type"});

    return type === DISAGGREGATION_TYPES.CUSTOM_VALUE ? <div className="col gap-16 col-sm-12">
        <CustomValueField name="values" label={i18n.t("Add options")}/>
    </div> : null;
}

function DataTypeSelector() {
    const dataType = useWatch({name: "dataType"});

    return <div className="row-gap-16">
        {
            dataType === "dataElement" && <>
                <div className="col-sm-6">
                    <CustomSingleSelectField options={[
                        {
                            label: "Program stage 1",
                            value: "programStage1"
                        }
                    ]} name="programStage" label={i18n.t("Program stage")}/>
                </div>
                <div className="col-sm-6">
                    <CustomSingleSelectField options={[
                        {
                            label: "Data element 1",
                            value: "dataElement1"
                        }
                    ]} name="dataElement" label={i18n.t("Data Element")}/>
                </div>
            </>
        }
        {
            dataType === "attribute" && <>
                <div className="col-sm-12">
                    <CustomSingleSelectField options={[]} name="attribute" label={i18n.t("Attribute")}/>
                </div>
            </>
        }
    </div>;
}

export default function Form(): React.ReactElement {

    return (
        <form>
            <div className={classes["form-group"]}>
                <label>{i18n.t("Filter by")}</label>
                <div className="row-gap-16">
                    <div className="col-sm-6">
                        <CustomRadioField name="dataType" radioValue="dataElement" dataTest="data-element-radio-option"
                                          label={i18n.t("Data element")}/>
                    </div>
                    <div className="col-sm-6">
                        <CustomRadioField name="dataType" radioValue="attribute" dataTest="attribute-radio-option"
                                          label={i18n.t("Attribute")}/>
                    </div>
                </div>
                <DataTypeSelector/>
            </div>
            <div className={classes["form-group"]}>
                <label>{i18n.t("Disaggregation options")}</label>
                <div className="row-gap-16">
                    <div className="col gap-16 col-sm-12">
                        <CustomSingleSelectField options={DISAGGREGATION_TYPES_OPTIONS} name="type"
                                                 label={i18n.t("Disaggregation type")}/>
                    </div>
                </div>
                <div className="row-gap-16">
                    <OptionSetDisaggregationType/>
                </div>
                <div className="row-gap-16">
                    <CustomValueDisaggregationType/>
                </div>

            </div>
            <div className={classes["form-group"]}>
                <label>{i18n.t("Disaggregation name")}</label>
                <div className="row-gap-16">
                    <div className="col-sm-12">
                        <InputField
                            helpText={`${i18n.t("You can access the disaggregation value using the placeholder")} {{ disaggregationValue }}`}
                            label={i18n.t("Disaggregated indicators name template")}/>
                    </div>
                </div>
            </div>
        </form>
    )
}
