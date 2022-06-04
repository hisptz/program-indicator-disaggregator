import React from 'react'
import {Controller} from "react-hook-form";
import {Button, ButtonStrip, Checkbox, Field} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import {intersection, isEmpty} from "lodash";

export default function MultipleOptionsField({
                                                 name,
                                                 label,
                                                 options,
                                                 ...props
                                             }: { name: string, label: string, options: { label: string, value: string }[], [key: string]: any }): React.ReactElement {

    return (
        <Controller
            name={name}
            render={({field: {value, onChange, ref}}) => (
                <Field {...props} label={label}>
                    <div className="col gap-16">
                        <ButtonStrip>
                            <Button
                                disabled={intersection(value, options.map(option => option.value)).length === options.length}
                                onClick={() => {
                                    onChange(options?.map(({value}) => value))
                                }}>{i18n.t("Select all")}</Button>
                            <Button disabled={!value || isEmpty(value)} onClick={() => {
                                onChange([])
                            }}>{i18n.t("Select none")}</Button>
                        </ButtonStrip>
                        <div ref={ref} className="row-gap-8 flex-wrap">
                            {
                                options.map(({label, value: optionValue}) => (
                                    <Checkbox
                                        checked={value?.includes(optionValue)}
                                        onChange={({checked}: { checked: boolean }) => {
                                            if (checked) {
                                                onChange([...(value ?? []), optionValue])
                                            } else {
                                                onChange((value ?? [])?.filter((item: any) => item !== optionValue))
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
