import React from 'react'
import {Controller} from "react-hook-form";
import {SingleSelectField, SingleSelectOption} from '@dhis2/ui'

export default function CustomSingleSelectField({
                                                    options,
                                                    name,
                                                    validations,
                                                    ...props
                                                }: { options: { label: string, value: any }[], validations?: Record<string, any>, name: string, [key: string]: any }): React.ReactElement {


    return (
        <Controller
            name={name}
            rules={validations}
            render={({field: {value, onBlur, onChange, name, ref}, fieldState: {error}}) => (
                <SingleSelectField
                    {...props}
                    validationText={error?.message}
                    error={!!error}
                    selected={options.filter(option => option.value === value).length > 0 ? value : undefined}
                    filterable
                    name={name}
                    ref={ref}
                    onChange={({selected}: { selected: any }) => onChange(selected)}
                    onBlur={onBlur}
                >
                    {
                        options.map(({label, value}) => (
                            <SingleSelectOption
                                key={`${value}-option`}
                                value={value}
                                label={label}
                            />
                        ))
                    }
                </SingleSelectField>
            )}
        />)
}
