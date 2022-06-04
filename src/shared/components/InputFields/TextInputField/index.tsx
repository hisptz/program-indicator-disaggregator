import React from 'react'
import {Controller} from "react-hook-form";
import {InputField} from '@dhis2/ui'

export default function CustomTextInputField({
                                                 name,
                                                 ...props
                                             }: { name: string; [key: string]: any }): React.ReactElement {


    return (
        <Controller
            name={name}
            render={({field: {value, onChange, ref, onBlur}}) => (
                <InputField
                    {...props}
                    onBlur={onBlur}
                    ref={ref}
                    value={value}
                    onChange={({value}: { value: string }) => onChange(value)}
                />
            )}

        />
    )

}
