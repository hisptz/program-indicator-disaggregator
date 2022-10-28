import React from 'react'
import {Controller} from "react-hook-form";
import {Button, ButtonStrip, Checkbox, Field} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import {find, intersection, isEmpty, map} from "lodash";
import {VALUE_TYPES} from "../../../constants";

export default function MultipleOptionsField({
                                                 name,
                                                 label,
                                                 options,
                                                 validations,
                                                 dataSelected,
                                                 ...props
                                             }: { name: string, validations?: Record<string, any>, label: string, options: { label: string, value: string }[], dataSelected: any; [key: string]: any }): React.ReactElement {

    return (
        <Controller
            name={name}
            rules={validations}
            render={({field: {value, onChange, ref}, fieldState: {error}}) => (
                <Field error={!!error} validationText={error?.message}  {...props} label={label}>
                    <div className="col gap-16">
                        <ButtonStrip>
                            <Button
                                disabled={intersection(value, options.map(option => option.value)).length === options.length}
                                onClick={() => {
                                    onChange(options?.map(({value, label}) => {
                                        const valueType = dataSelected?.valueType;
                                        return {value, name: label, valueType}
                                    }))
                                }}>{i18n.t("Select all")}</Button>
                            <Button disabled={!value || isEmpty(value)} onClick={() => {
                                onChange([])
                            }}>{i18n.t("Select none")}</Button>
                        </ButtonStrip>
                        <div ref={ref} style={{maxHeight: 200, overflow: "auto"}} className="row-gap-8 flex-wrap">
                            {
                                map(options, ({label, value: optionValue}) => (
                                    <Checkbox
                                        checked={!!find(value, {value: optionValue})}
                                        onChange={({checked}: { checked: boolean }) => {
                                            const valueType = dataSelected?.valueType;
                                            if (checked) {
                                                onChange([...(value ?? []), {
                                                    value: optionValue,
                                                    name: label,
                                                    valueType
                                                }])
                                            } else {
                                                onChange((value ?? [])?.filter((item: any) => item.value !== optionValue))
                                            }
                                        }}
                                        label={label}
                                        key={`${label}-option`}
                                    />
                                ))
                            }
                        </div>

                    </div>
                </Field>
            )}

        />
    )

}
