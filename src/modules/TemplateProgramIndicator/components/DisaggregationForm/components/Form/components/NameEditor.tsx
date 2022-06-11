import {ProgramIndicator} from "../../../../../../../shared/interfaces/metadata";
import {useFormContext, useWatch} from "react-hook-form";
import React, {useEffect} from "react";
import classes from "../../../DisaggregationForm.module.css";
import i18n from "@dhis2/d2-i18n";
import CustomTextInputField from "../../../../../../../shared/components/InputFields/TextInputField";
import {getSelectedData} from "../utils";

export function NameEditor({pi}: { pi: ProgramIndicator }): React.ReactElement | null {
    const [data, dataType] = useWatch({name: ["data", "dataType"]});
    const {setValue} = useFormContext();

    const selectedData = getSelectedData(pi, data, dataType);

    useEffect(() => {
        if (selectedData) {
            setValue("nameTemplate", `${selectedData?.displayName ?? ""} - {{ disaggregationValue }}`);
        }
    }, [pi.displayName, setValue, data, dataType, selectedData]);

    return data ? <div className={classes["form-group"]}>
        <label>{i18n.t("Disaggregation name prefix")}</label>
        <div className="row-gap-16">
            <div className="col-sm-12">
                <CustomTextInputField
                    required
                    validations={{
                        required: `${i18n.t("Disaggregation name is required")}`,
                        validate: {
                            hasValueIncluded: (value: string) => {
                                return value.includes("{{ disaggregationValue }}") || `${i18n.t("Field must contain ")} {{ disaggregationValue }}`;
                            },
                            isNotTooLong: (value: string) => {
                                const shortNameLength = (pi.shortName?.length ?? 0) + value.length;
                                return shortNameLength <= 50 || i18n.t("Field must be less than {{ chars }} characters", {chars: 50 - (pi.shortName?.length ?? 0)});
                            }
                        }
                    }}
                    name={`nameTemplate`}
                    helpText={`${i18n.t("This will be prefixed to name, and short name.")} \n ${i18n.t("You can access the disaggregation value using the placeholder")} {{ disaggregationValue }}`}
                    label={i18n.t("Disaggregated indicators name prefix template")}
                />
            </div>
        </div>
    </div> : null;
}
