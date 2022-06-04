import React from 'react'
import {Controller} from "react-hook-form";
import {Checkbox, Field} from '@dhis2/ui'

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
                    <div ref={ref} className="col gap-16 col-sm-12">
                        {
                            options.map(({label, value: optionValue}) => (
                                <Checkbox
                                    checked={value.includes(optionValue)}
                                    onChange={({checked}: { checked: boolean }) => {
                                        if (checked) {
                                            onChange([...(value ?? []), optionValue])
                                        } else {
                                            onChange(value.filter((item: any) => item !== optionValue))
                                        }

                                    }}
                                    label={label}
                                    key={`${label}-option`}
                                />
                            ))
                        }
                    </div>
                </Field>
            )}

        />
    )

}
