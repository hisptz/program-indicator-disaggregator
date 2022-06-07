import React from "react";
import {useWatch} from "react-hook-form";
import {DISAGGREGATION_TYPES} from "../../../../../../../shared/constants";
import CustomValueField from "../../../../../../../shared/components/InputFields/CustomValueField";
import i18n from "@dhis2/d2-i18n";

export function CustomValueDisaggregationType({valueType}: { valueType: string }): React.ReactElement | null {
    const type = useWatch({name: "type"});
    return type === DISAGGREGATION_TYPES.CUSTOM_VALUE ? <div className="col gap-16 col-sm-12">
        <CustomValueField
            validations={{
                required: `${i18n.t("Please enter at least one value")}`,
                validate: (value: Array<string>) => value.length > 0 || `${i18n.t("Please enter at least one value")}`
            }}
            type={valueType.toLowerCase()} name="values"
            label={i18n.t("Add options")}/>
    </div> : null;
}
