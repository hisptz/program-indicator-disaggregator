import React from 'react'
import {Controller} from "react-hook-form";
import {CheckboxField} from '@dhis2/ui'

export default function CustomCheckboxField({
                                                name,
                                                validations,
                                                ...props
                                            }: { name: string, validations?: Record<string, any>, [key: string]: any }): React.ReactElement {


    return (
        <Controller
            name={name}
            rules={validations}
            render={({field: {value, onBlur, onChange, name, ref}, fieldState: {error}}) => (
                <CheckboxField
                    validationText={error?.message}
                    error={!!error}
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
