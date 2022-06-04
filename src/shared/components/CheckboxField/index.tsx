import React from 'react'
import {Controller} from "react-hook-form";
import {CheckboxField} from '@dhis2/ui'

export default function CustomCheckboxField({
                                                name,
                                                ...props
                                            }: { name: string, [key: string]: any }): React.ReactElement {


    return (
        <Controller
            name={name}
            render={({field: {value, onBlur, onChange, name, ref}}) => (
                <CheckboxField
                    {...props}
                    checked={value}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={({checked}: { checked: boolean }) => onChange(checked)}
                />
            )}
        />
    )
}
