import React, {useState} from 'react'
import {DisaggregationConfig as DisaggregationConfigType} from "../../../../shared/interfaces";
import {Box, Button, ButtonStrip, Card, Tag} from "@dhis2/ui";
import type {DataElement, ProgramIndicator, TrackedEntityAttribute} from "@hisptz/dhis2-utils";
import i18n from '@dhis2/d2-i18n'
import {getSelectedData} from "../DisaggregationForm/components/Form/utils";
import {DATA_TYPES} from "../../../../shared/constants";
import classes from "./Disaggregation.module.css"
import DisaggregationList from "../DisaggregationList";
import {useAlert, useDataEngine} from "@dhis2/app-runtime";
import {updateIndicators} from "../../../../shared/utils";

export default function DisaggregationConfig({
                                                 config,
                                                 pi
                                             }: { config: DisaggregationConfigType, pi: ProgramIndicator }): React.ReactElement {

    const [openDisaggregationList, setOpenDisaggregationList] = useState(false);
    const [updating, setUpdating] = useState(false);
    const engine = useDataEngine();
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))

    const dataSelected: TrackedEntityAttribute | DataElement | undefined = getSelectedData(pi, config.data, config.dataType);
    const title = `${pi.displayName} ${i18n.t("disaggregated by")} ${dataSelected?.displayName}`

    const onUpdate = async () => {
        try {
            setUpdating(true);
            await updateIndicators(engine, pi, config);
            show({
                message: 'Program indicators updated successfully',
                type: {success: true}
            })
        } catch (e: any) {
            show({
                message: e.message,
                type: {error: true}
            })
        } finally {
            setUpdating(false);
        }
    }

    return (
        <Box width="100%">
            <Card>
                <div className="p-16 col gap-16">
                    <h4 className={classes.header}>{title}</h4>
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
                                                                                                key={`${value}-tag`}>{value.name}</Tag>)}</div>
                    </div>
                    <div className={classes.footer}>
                        <ButtonStrip>
                            <Button loading={updating} onClick={onUpdate}>
                                {i18n.t("Update")}
                            </Button>
                            <Button
                                onClick={() => setOpenDisaggregationList(true)}>{i18n.t("View disaggregations")}</Button>
                            {
                                openDisaggregationList ? <DisaggregationList open={openDisaggregationList}
                                                                             onClose={() => setOpenDisaggregationList(false)}
                                                                             title={title} config={config}/> : null
                            }
                        </ButtonStrip>
                    </div>
                </div>
            </Card>
        </Box>
    )
}
