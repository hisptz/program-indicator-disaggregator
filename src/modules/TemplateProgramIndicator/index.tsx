import React, {useState} from 'react'
import {useParams} from "react-router-dom";
import {Button} from '@dhis2/ui'
import DisaggregationForm from "./components/DisaggregationForm";
import i18n from '@dhis2/d2-i18n'


export default function TemplateProgramIndicator(): React.ReactElement {
    const {id} = useParams<{ id: string }>();
    const [open, setOpen] = useState(false);

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
