import React from 'react'
import {Controller} from "react-hook-form";
import {Radio} from '@dhis2/ui'

export default function CustomRadioField({
                                             name,
                                             radioValue,
                                             ...props
                                         }: { name: string, radioValue: string, [key: string]: any }): React.ReactElement {


    return (
        <Controller
            name={name}
            render={({field: {value, onBlur, onChange, name, ref}}) => (
                <Radio
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
