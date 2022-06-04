import React from 'react'
import {Button, CheckboxField, Field, IconAdd24, IconDelete24, InputField, Radio, SingleSelectField} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import classes from "../../DisaggregationForm.module.css"

function OptionSetDisaggregationType() {
    return <div className="col-sm-12">
        <Field label={i18n.t("Select options")}>
            <div className="col gap-16 col-sm-12">
                <CheckboxField label="Option 1"/>
                <CheckboxField label="Option 2"/>
                <CheckboxField label="Option 3"/>
            </div>
        </Field>
    </div>;
}

function CustomValueDisaggregationType() {
    return <div className="col gap-16 col-sm-6">
        <Field label={i18n.t("Add values")}>
            <div className="row-gap-16 align-middle">
                <InputField/>
                <Button icon={<IconDelete24/>}/>
            </div>
        </Field>
        <Button icon={<IconAdd24/>}>{i18n.t("Add value")}</Button>
    </div>;
}

export default function Form(): React.ReactElement {

    return (
        <form>
            <div className={classes["form-group"]}>
                <label>{i18n.t("Filter by")}</label>
                <div className="row-gap-16">
                    <div className="col-sm-6">
                        <Radio label={i18n.t("Data element")}/>
                    </div>
                    <div className="col-sm-6">
                        <Radio label={i18n.t("Attribute")}/>
                    </div>
                </div>
                <div className="row-gap-16">
                    <div className="col-sm-6">
                        <SingleSelectField label={i18n.t("Program stage")}/>
                    </div>
                    <div className="col-sm-6">
                        <SingleSelectField label={i18n.t("Data Element")}/>
                    </div>
                </div>
            </div>
            <div className={classes["form-group"]}>
                <label>{i18n.t("Disaggregation options")}</label>
                <div className="row-gap-16">
                    <div className="col gap-16 col-sm-12">
                        <SingleSelectField label={i18n.t("Disaggregation type")}/>
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
