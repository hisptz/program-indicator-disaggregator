import React, {useEffect} from 'react'
import {CircularLoader} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import classes from "../../DisaggregationForm.module.css"
import CustomSingleSelectField from "../../../../../../shared/components/InputFields/SingleSelectField";
import CustomRadioField from "../../../../../../shared/components/InputFields/RadioField";
import {useFormContext, useWatch} from "react-hook-form";
import {
    DISAGGREGATION_TYPES,
    DISAGGREGATION_TYPES_OPTIONS,
    PROGRAM_INDICATOR_QUERY,
    PROGRAM_TYPES,
    SUPPORTED_VALUE_TYPES
} from "../../../../../../shared/constants";
import MultipleOptionsField from "../../../../../../shared/components/InputFields/MultipleOptionsField";
import CustomValueField from "../../../../../../shared/components/InputFields/CustomValueField";
import {useDataQuery} from "@dhis2/app-runtime";
import {useParams} from "react-router-dom";
import {DataElement, ProgramIndicator, TrackedEntityAttribute} from "../../../../../../shared/interfaces/metadata";
import CustomTextInputField from "../../../../../../shared/components/InputFields/TextInputField";

function OptionSetDisaggregationType({options}: { options: { label: string, value: any }[] }): React.ReactElement | null {
    const type = useWatch({name: "type"});
    return type === DISAGGREGATION_TYPES.OPTION_SET ? <div className="col-sm-12">
        <MultipleOptionsField
            name="disaggregationValues"
            label={i18n.t("Select options")}
            options={options}
        />
    </div> : null;
}

function CustomValueDisaggregationType({valueType}: { valueType: string }): React.ReactElement | null {
    const type = useWatch({name: "type"});
    return type === DISAGGREGATION_TYPES.CUSTOM_VALUE ? <div className="col gap-16 col-sm-12">
        <CustomValueField
            type={valueType.toLowerCase()} name="disaggregationValues"
            label={i18n.t("Add options")}/>
    </div> : null;
}

function DataTypeSelector({pi}: { pi: ProgramIndicator }) {
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
            dataType === "dataElement" && <>
                <div className="col-sm-6">
                    <CustomSingleSelectField options={programStages ?? []} name="programStage"
                                             label={i18n.t("Program stage")}/>
                </div>
                <div className="col-sm-6">
                    <CustomSingleSelectField
                        disabled={!selectedProgramStage}
                        options={dataElements} name="data"
                        label={i18n.t("Data Element")}/>
                </div>
            </>
        }
        {
            dataType === "attribute" && <>
                <div className="col-sm-12">
                    <CustomSingleSelectField options={attributes} name="data" label={i18n.t("Attribute")}/>
                </div>
            </>
        }
    </div>;
}

function getSelectedData(pi: ProgramIndicator, data: string, dataType: string): DataElement | TrackedEntityAttribute | undefined {
    if (dataType === "dataElement") {
        const programStage = pi.program.programStages?.find(ps => ps.programStageDataElements?.find(psde => psde.dataElement.id === data));
        return programStage?.programStageDataElements?.find(psde => psde.dataElement.id === data)?.dataElement;
    }

    if (dataType === "attribute") {
        return pi.program.programTrackedEntityAttributes?.find(pta => pta.trackedEntityAttribute.id === data)?.trackedEntityAttribute;
    }
}

function DisaggregationOptions({pi}: { pi: ProgramIndicator }) {
    const [data, dataType] = useWatch({name: ["data", "dataType"]});
    const {setValue} = useFormContext();
    const dataSelected = getSelectedData(pi, data, dataType);
    const disaggregationOptions = DISAGGREGATION_TYPES_OPTIONS.filter(option => {
        if (dataSelected?.optionSet) {
            return option.value === DISAGGREGATION_TYPES.OPTION_SET;
        }
        if (["TEXT", "NUMBER"].includes(dataSelected?.valueType ?? '')) {
            return option.value === DISAGGREGATION_TYPES.CUSTOM_VALUE;
        }
        return false;
    });
    const options = dataSelected?.optionSet?.options?.map(option => ({
        label: option.displayName ?? "",
        value: option.code
    })) ?? [];

    useEffect(() => {
        if (disaggregationOptions.length === 1) {
            setValue("type", disaggregationOptions[0].value);
        }
    }, [disaggregationOptions, setValue]);
    useEffect(() => {
        setValue("disaggregationValues", []);
    }, [data, setValue]);


    return data ? <div className={classes["form-group"]}>
        <label>{i18n.t("Disaggregation options")}</label>
        <div className="row-gap-16">
            <div className="col gap-16 col-sm-12">
                <CustomSingleSelectField disabled={options.length > 0} options={disaggregationOptions} name="type"
                                         label={i18n.t("Disaggregation type")}/>
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

function MainDataTypeSelector({pi}: { pi: ProgramIndicator }) {
    const dataType = useWatch({name: "dataType"});
    const {setValue} = useFormContext();
    const isEventProgram = pi.program.programType === PROGRAM_TYPES.WITHOUT_REGISTRATION;

    //Clear data value on data type change
    useEffect(() => {
        setValue("data", "");
        if (dataType === "attribute") {
            setValue("programStage", "");
        }
    }, [dataType, setValue]);

    //Auto assign data element for event programs
    useEffect(() => {
        if (isEventProgram) {
            setValue("dataType", "dataElement");
        }
    }, [isEventProgram, pi.program.programType, setValue]);

    return <div className={classes["form-group"]}>
        <label>{i18n.t("Disaggregate by")}</label>
        <div className="row-gap-16">
            <div className="col-sm-6">
                <CustomRadioField name="dataType" radioValue="dataElement" dataTest="data-element-radio-option"
                                  label={i18n.t("Data element")}/>
            </div>
            <div className="col-sm-6">
                <CustomRadioField disabled={isEventProgram} name="dataType" radioValue="attribute"
                                  dataTest="attribute-radio-option"
                                  label={i18n.t("Attribute")}/>
            </div>
        </div>
        <DataTypeSelector pi={pi}/>
    </div>;
}

function NameEditor({pi}: { pi: ProgramIndicator }) {
    const [data, nameTemplate] = useWatch({name: ["data", "nameTemplate"]});
    const {setValue} = useFormContext();

    useEffect(() => {
        if (!nameTemplate) {
            setValue("nameTemplate", `${pi.displayName} - {{ disaggregationValue }}`)
        }
    }, [pi.displayName, setValue, data]);

    return data ? <div className={classes["form-group"]}>
        <label>{i18n.t("Disaggregation name")}</label>
        <div className="row-gap-16">
            <div className="col-sm-12">
                <CustomTextInputField
                    required
                    name={`nameTemplate`}
                    helpText={`${i18n.t("You can access the disaggregation value using the placeholder")} {{ disaggregationValue }}`}
                    label={i18n.t("Disaggregated indicators name template")}/>
            </div>
        </div>
    </div> : null;
}

export default function Form(): React.ReactElement {
    const {id} = useParams<{ id: string }>();
    const {loading, data, error} = useDataQuery(PROGRAM_INDICATOR_QUERY, {variables: {id}})

    if (loading) {
        return <div style={{
            height: "100%",
            width: "100%",
            minHeight: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <CircularLoader small/>
        </div>
    }

    if (error) {
        return <h3>{error.message}</h3>
    }

    const pi = data?.programIndicator as ProgramIndicator;

    return (
        <form>
            <MainDataTypeSelector pi={pi}/>
            <DisaggregationOptions pi={pi}/>
            <NameEditor pi={pi}/>
        </form>
    )
}
