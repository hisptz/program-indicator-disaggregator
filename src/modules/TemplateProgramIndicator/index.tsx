import React, {useState} from 'react'
import {useParams} from "react-router-dom";
import {Button, CircularLoader} from '@dhis2/ui'
import DisaggregationForm from "./components/DisaggregationForm";
import i18n from '@dhis2/d2-i18n'
import {useDataQuery} from "@dhis2/app-runtime";
import {PROGRAM_INDICATOR_QUERY} from "../../shared/constants";


export default function TemplateProgramIndicator(): React.ReactElement {
    const {id} = useParams<{ id: string }>();
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

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12">
                    <h1>Template indicator: {id}</h1>
                    <Button onClick={() => setOpen(prevState => !prevState)}>{i18n.t("Open Disaggregator")}</Button>
                </div>
            </div>
            {
                open && (
                    <DisaggregationForm open={open} onClose={() => setOpen(false)}/>
                )
            }
        </div>
    )
}
