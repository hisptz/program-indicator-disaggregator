import React from 'react'
import {NameEditor} from "./components/NameEditor";
import {DisaggregationOptions} from "./components/DisaggregationOptions";
import {MainDataTypeSelector} from "./components/MainDataTypeSelector";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";

export default function Form({pi}: { pi: ProgramIndicator }): React.ReactElement {

    return (
        <form>
            <MainDataTypeSelector pi={pi}/>
            <DisaggregationOptions pi={pi}/>
            <NameEditor pi={pi}/>
        </form>
    )
}
