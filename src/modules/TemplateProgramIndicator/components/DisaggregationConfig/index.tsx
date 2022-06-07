import React from 'react'
import {DisaggregationConfig as DisaggregationConfigType} from "../../../../shared/interfaces";
import {Box, Button, Card, Tag} from "@dhis2/ui";
import type {DataElement, ProgramIndicator, TrackedEntityAttribute} from "@hisptz/dhis2-utils";
import i18n from '@dhis2/d2-i18n'
import {getSelectedData} from "../DisaggregationForm/components/Form/utils";
import {DATA_TYPES} from "../../../../shared/constants";
import classes from "./Disaggregation.module.css"

export default function DisaggregationConfig({
                                                 config,
                                                 pi
                                             }: { config: DisaggregationConfigType, pi: ProgramIndicator }): React.ReactElement {

    const dataSelected: TrackedEntityAttribute | DataElement | undefined = getSelectedData(pi, config.data, config.dataType);

    return (
        <Box width="100%">
            <Card>
                <div className="p-16 col gap-16">
                    <h4 className={classes.header}>{pi.displayName} {i18n.t("disaggregated by")} {dataSelected?.displayName}</h4>
                    <div className={classes.data}><label>{i18n.t("Program")}:</label> {pi.program.displayName}</div>
                    {
                        config.dataType === DATA_TYPES.DATA_ELEMENT && <>
                            <div className={classes.data}><label>{i18n.t("Program Stage")}:</label> {pi.program.displayName}
                            </div>
                            <div className={classes.data}>
                                <label>{i18n.t("Data Element")}:</label> {dataSelected?.displayName}</div>
                        </>
                    }
                    {
                        config.dataType === DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE &&
                        <div className={classes.data}><label>{i18n.t("Attribute")}:</label> {dataSelected?.displayName}
                        </div>
                    }
                    <div className={classes.data}><label>{i18n.t("Disaggregated values")}:</label>
                        <div
                            className="row-gap-8 align-middle">{config.values.map(value => <Tag bold
                                                                                                key={`${value}-tag`}>{value}</Tag>)}</div>
                    </div>
                    <div className={classes.footer}>
                        <Button>{i18n.t("View disaggregations")}</Button>
                    </div>
                </div>
            </Card>
        </Box>
    )
}
