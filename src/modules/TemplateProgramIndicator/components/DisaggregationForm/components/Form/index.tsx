import React from 'react'
import {NameEditor} from "./components/NameEditor";
import {DisaggregationOptions} from "./components/DisaggregationOptions";
import {MainDataTypeSelector} from "./components/MainDataTypeSelector";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import { DisaggregationConfig } from '../../../../../../shared/interfaces';

export default function Form({pi, config}: { pi: ProgramIndicator, config?: DisaggregationConfig }): React.ReactElement {

    return (
        <form>
            <MainDataTypeSelector config={config} pi={pi}/>
            <DisaggregationOptions pi={pi}/>
            <NameEditor pi={pi}/>
        </form>
    )
}
