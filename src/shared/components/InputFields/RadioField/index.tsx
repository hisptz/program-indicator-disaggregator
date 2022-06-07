import React from 'react'
import {Controller} from "react-hook-form";
import {Radio} from '@dhis2/ui'

export default function CustomRadioField({
                                             name,
                                             radioValue,
                                             validations,
                                             ...props
                                         }: { name: string, validations?: Record<string, any>, radioValue: string, [key: string]: any }): React.ReactElement {


    return (
        <Controller
            name={name}
            rules={validations}
            render={({field: {value, onBlur, onChange, name, ref}, fieldState: {error}}) => (
                <Radio
                    validationText={error?.message}
                    error={!!error}
                    {...props}
                    value={radioValue}
                    name={name}
                    checked={value === radioValue}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={({checked}: { checked: boolean }) => checked && onChange(radioValue)}
                />
            )}
        />
    )
}
