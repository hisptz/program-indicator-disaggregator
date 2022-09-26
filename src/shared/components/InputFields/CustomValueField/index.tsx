import React, { useState, useEffect } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Controller } from "react-hook-form";
import { Button, Chip, Field, IconAdd24, InputField, SingleSelectField, SingleSelectOption, CircularLoader } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useWatch } from "react-hook-form";
import { DISAGGREGATION_TYPES, queryResponse } from "../../../constants";

const supportedOperators: string[] = ['==', '>', '<', '<=', '>=', '!='];
export default function CustomValueField({
    name,
    label,
    type,
    validations,
    ...props
}: { name: string, validations?: Record<string, any>, label: string, type?: string, [key: string]: any }): React.ReactElement {

    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState("==");
    const disaggrationType = useWatch({ name: "type" });
    const { loading, error, data } = useDataQuery(queryResponse);
    function checkDisableStatus() {
        return (
            type === 'text'
        )
    }
    useEffect(() => {
        setSelectValue("==")
    }, [type]);

    return (
        <Controller
            name={name}
            rules={validations}
            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                <Field validationText={error?.message} error={!!error} {...props} label={label}>
                    <div ref={ref} className="col gap-16">
                        <div className="row-gap-8 flex-wrap">
                            {
                                (value ?? [])?.map((item: { value: string; name: string, operator: string, valueType: string }, index: number) => (
                                    <Chip
                                        key={`${item.name}-chip-${index}`}
                                        onRemove={() => onChange(value.filter((i: any) => i !== item))}
                                    >{`${item.operator} ${item.name}`}</Chip>
                                ))
                            }
                        </div>
                        <div className="row-gap-16">
                            <SingleSelectField
                                name={`${name}-select`}
                                disabled={checkDisableStatus()}
                                selected={selectValue}
                                onChange={({ selected: value }: any) => setSelectValue(value)}
                            >
                                {
                                    supportedOperators.map((operator, index) => <SingleSelectOption key={`${operator}-${index}`} label={operator} value={operator} />)
                                }
                            </SingleSelectField>
                            {
                                (disaggrationType === DISAGGREGATION_TYPES.CUSTOM_VALUE) ? <InputField
                                    type={type}
                                    value={inputValue}
                                    onChange={({ value }: { value: string }) => setInputValue(value)}
                                    name={`${name}-input`}
                                    placeholder={i18n.t("Add new")}
                                /> :
                                    (disaggrationType === DISAGGREGATION_TYPES.CONSTANT_VALUE) ?
                                        <SingleSelectField name={`${name}-input`} selected={inputValue}
                                            onChange={({ selected: value }: any) => setInputValue(value)}>
                                            {loading && <CircularLoader />}
                                            {error && <span>{`ERROR: ${error.message}`}</span>}
                                            {data && (
                                                (data as Record<string, any>).constantsQuery?.constants.map((constant: any) =>
                                                    <SingleSelectOption key={`${constant.id}`} label={constant.displayName} value={`C{${constant.id}}`} />)
                                            )}
                                        </SingleSelectField>
                                        : null
                            }
                            <Button
                                icon={<IconAdd24 />}
                                onClick={() => {
                                    if (inputValue && selectValue) {
                                        onChange([...(value ?? []), { value: inputValue, name: inputValue, operator: selectValue, valueType: type },]);
                                        setSelectValue("==");
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
