import React from 'react'
import {DisaggregationConfig as DisaggregationConfigType} from "../../../../shared/interfaces";
import {Box, Card} from "@dhis2/ui";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";

export default function DisaggregationConfig({
                                                 config,
                                                 pi
                                             }: { config: DisaggregationConfigType, pi: ProgramIndicator }): React.ReactElement {


    return (
        <Box width="100%" height={"200px"}>
            <Card>
                <div className="p-16 col gap-16">
                    <h4 style={{margin: 0}}>{config.id}</h4>
                    <div>Program: {pi.program.displayName}</div>
                    <div>Program Stage: {pi.program.displayName}</div>
                    <div>Attribute: {config.data}</div>
                </div>
            </Card>
        </Box>
    )
}
