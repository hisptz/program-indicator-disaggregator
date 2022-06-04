import React from 'react'
import {Controller} from "react-hook-form";
import {SingleSelectField, SingleSelectOption} from '@dhis2/ui'

export default function CustomSingleSelectField({
                                                    options,
                                                    name,
                                                    ...props
                                                }: { options: { label: string, value: any }[], name: string, [key: string]: any }): React.ReactElement {


    return (
        <Controller
            name={name}
            render={({field: {value, onBlur, onChange, name, ref}}) => (
                <SingleSelectField
                    {...props}
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
