import {ProgramIndicator} from "../../../../../../../shared/interfaces/metadata";
import {useFormContext, useWatch} from "react-hook-form";
import React, {useEffect} from "react";
import classes from "../../../DisaggregationForm.module.css";
import i18n from "@dhis2/d2-i18n";
import CustomTextInputField from "../../../../../../../shared/components/InputFields/TextInputField";

export function NameEditor({pi}: { pi: ProgramIndicator }): React.ReactElement | null {
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
                    label={i18n.t("Disaggregated indicators name template")}
                />
            </div>
        </div>
    </div> : null;
}
