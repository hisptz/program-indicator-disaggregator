import React, {useState} from 'react'
import {Controller} from "react-hook-form";
import {Button, Chip, Field, IconAdd24, InputField} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

export default function CustomValueField({
                                             name,
                                             label,
                                             ...props
                                         }: { name: string, label: string, [key: string]: any }): React.ReactElement {

    const [inputValue, setInputValue] = useState("");


    return (
        <Controller
            name={name}
            render={({field: {value, onChange, ref}}) => (
                <Field {...props} label={label}>
                    <div ref={ref} className="col gap-16">
                        <div className="row-gap-8 flex-wrap">
                            {
                                (value ?? [])?.map((item: string) => (
                                    <Chip
                                        key={`${item}-chip`}
                                        onRemove={() => onChange(value.filter((i: any) => i !== item))}
                                    >{item}</Chip>
                                ))
                            }
                        </div>
                        <div className="row-gap-16">
                            <InputField
                                value={inputValue}
                                onChange={({value}: { value: string }) => setInputValue(value)}
                                name={`${name}-input`}
                                placeholder={i18n.t("Add new")}
                            />
                            <Button
                                icon={<IconAdd24/>}
                                onClick={() => {
                                    if (inputValue) {
                                        onChange([...(value ?? []), inputValue]);
                                        setInputValue("");
                                    }
                                }}
                            >
                                {i18n.t("Add value")}
                            </Button>
                        </div>
                    </div>
                </Field>
            )}

        />
    )

}
