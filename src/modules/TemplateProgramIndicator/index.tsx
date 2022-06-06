import React, {useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Button, CircularLoader} from '@dhis2/ui'
import DisaggregationForm from "./components/DisaggregationForm";
import i18n from '@dhis2/d2-i18n'
import {useDataQuery} from "@dhis2/app-runtime";
import {PROGRAM_INDICATOR_QUERY} from "../../shared/constants";
import {ProgramIndicator} from "../../shared/interfaces/metadata";


export default function TemplateProgramIndicator(): React.ReactElement {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {loading, data, error} = useDataQuery(PROGRAM_INDICATOR_QUERY, {variables: {id}})

    if (loading) {
        return <div style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <CircularLoader small/>
        </div>
    }

    if (error) {
        return <h3>{error.message}</h3>
    }

    const pi: ProgramIndicator = data?.programIndicator as ProgramIndicator ?? {}

    return (
        <div className="container-fluid h-100 w-100">
            <div className="row-gap-16 space-between">
                <Button onClick={() => navigate("/")}>{i18n.t("Back")}</Button>
                <Button primary onClick={() => setOpen(prevState => !prevState)}>{i18n.t("Disaggregate")}</Button>
            </div>
            <div className="row-gap-16">
                <h2>{pi.displayName}</h2>
            </div>
            {
                open && (
                    <DisaggregationForm open={open}
                                        onClose={() => setOpen(false)}/>
                )
            }
        </div>
    )
}
