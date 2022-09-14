import React, {useState} from 'react'
import {Controller} from "react-hook-form";
import {Button, Chip, Field, IconAdd24, InputField, SingleSelectField, SingleSelectOption} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { any } from 'async';

const supportedOperators: string[] = ['==','>','<','<=','>=','!='];

export default function CustomValueField({
                                             name,
                                             label,
                                             type,
                                             validations,
                                             ...props
                                         }: { name: string, validations?: Record<string, any>, label: string, type?: string, [key: string]: any }): React.ReactElement {

    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState("==");


    return (
        <Controller
            name={name}
            rules={validations}
            render={({field: {value, onChange, ref}, fieldState: {error}}) => (
                <Field validationText={error?.message} error={!!error} {...props} label={label}>
                    <div ref={ref} className="col gap-16">
                        <div className="row-gap-8 flex-wrap">
                            {
                                (value ?? [])?.map((item: { value: string; name: string, operator: string }, index:number) => (
                                    <Chip
                                        key={`${item.name}-chip-${index}`}
                                        onRemove={() => onChange(value.filter((i: any) => i !== item))}
                                    >{`${item.operator} ${item.name}`}</Chip>
                                ))
                            }
                        </div>
                        <div className="row-gap-16">
                            <InputField
                                type={type}
                                value={inputValue}
                                onChange={({value}: { value: string }) => setInputValue(value)}
                                name={`${name}-input`}
                                placeholder={i18n.t("Add new")}
                            />
                            <SingleSelectField
                            name={`${name}-select`}
                              selected={selectValue}
                              onChange={({selected: value}:any) => setSelectValue(value)}
                              placeholder={i18n.t("Add Operator")}>
                                {
                                    supportedOperators.map((operator, index) => <SingleSelectOption key={`${operator}-${index}`} label={operator} value={operator} />)
                                }
                            </SingleSelectField>
                            <Button
                                icon={<IconAdd24/>}
                                onClick={() => {
                                    if (inputValue && selectValue) {
                                        onChange([...(value ?? []), {value: inputValue, name: inputValue, operator: selectValue},]);
                                        setSelectValue("");
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
