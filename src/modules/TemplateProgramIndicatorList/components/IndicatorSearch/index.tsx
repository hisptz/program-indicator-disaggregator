import i18n from "@dhis2/d2-i18n";
import React, {useEffect} from "react";
import {InputField, SingleSelectField, SingleSelectOption} from "@dhis2/ui";
import {debounce} from "lodash";
import {useDataQuery} from "@dhis2/app-runtime";
import type {Program} from "@hisptz/dhis2-utils";

const {useState} = React;

const query = {
    programs: {
        resource: "programs",
        params: {
            fields: "id,displayName",
        }
    }
}

type Props = {
    onSearch: (newPage: string) => void;
    onFilter: (program: string) => void;
};

export default function IndicatorSearch({
                                            onSearch,
                                            onFilter
                                        }: Props): React.ReactElement {
    const [searchValue, setSearchValue] = useState<string>("");
    const [program, setProgram] = useState<string>("");
    const {data, loading, error} = useDataQuery(query);


    useEffect(() => {
        onFilter(program);
    }, [program]);

    const programs: Program[] = (data?.programs as any)?.programs ?? [];


    return (
        <div className="row-gap-16">
            <InputField
                value={searchValue}
                onChange={({value}: any) => {
                    setSearchValue(value);
                    debounce((value) => onSearch(value), 500)(value);
                }}
                placeholder={i18n.t("Search by name, code or id")}
            />
            <div style={{minWidth: "300px"}}>
                <SingleSelectField
                    clearable
                    selected={program}
                    onChange={({selected}: { selected: string }) => setProgram(selected)}
                    filterable
                    loading={loading}
                    disabled={loading || !!error}
                    placeholder={i18n.t("Select program")}>
                    {
                        programs.map((program) => (
                            <SingleSelectOption key={`${program.id}-option`} label={program.displayName}
                                                value={program.id}/>
                        ))
                    }
                </SingleSelectField>
            </div>
        </div>
    );
}
