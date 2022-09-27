import React, {useEffect, useState} from 'react'
import {DisaggregationConfig as DisaggregationConfigType} from "../../../../shared/interfaces";
import {Box, Button,Modal, ModalContent, ButtonStrip, Card, NoticeBox, Tag, IconAdd24, CircularLoader} from "@dhis2/ui";
import type {DataElement, ProgramIndicator, TrackedEntityAttribute} from "@hisptz/dhis2-utils";
import i18n from '@dhis2/d2-i18n'
import {getSelectedData} from "../DisaggregationForm/components/Form/utils";
import {DATA_TYPES} from "../../../../shared/constants";
import classes from "./Disaggregation.module.css"
import DisaggregationList from "../DisaggregationList";
import {useAlert, useDataEngine} from "@dhis2/app-runtime";
import {updateIndicators} from "../../../../shared/utils";
import {checkUpdateStatus} from "../../utils";
import { DictionaryAnalysis } from "@hisptz/react-ui"
import { Variable } from '../../../../shared/interfaces/metadata';
import { useSelectedProgramIndicator } from '../../../../shared/hooks';
import DisaggregationForm from '../DisaggregationForm';

export default function DisaggregationConfig({
                                                 config,
                                                 pi
                                             }: { config: DisaggregationConfigType, pi: ProgramIndicator }): React.ReactElement {

    const [openDisaggregationList, setOpenDisaggregationList] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [templateUpdated, setTemplateUpdated] = useState<boolean | undefined>();
    const [refresh, setRefresh] = useState(false);
    const engine = useDataEngine();
    const [hide, setHide] = useState(true);
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const dataSelected: TrackedEntityAttribute | DataElement | Variable |undefined = getSelectedData(pi, config.data, config.dataType);
    const title = `${pi.displayName} ${i18n.t("disaggregated by")} ${dataSelected?.displayName}`
    const [open, setOpen] = useState(false);
    const {error, loading} = useSelectedProgramIndicator();
    const onOpen = () => setOpen((prevState) => !prevState)

    if (loading) {
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularLoader small/>
            </div>
        );
    }
    if (error) {
        return <h3>{error.message}</h3>;
    }

    useEffect(() => {
        checkUpdateStatus(engine, config, pi)
            .then((updated) => setTemplateUpdated(updated))
            .catch((error) => {
                show({
                    message: i18n.t("Could not check program indicators update status." + ` ${error.message}`),
                    type: {info: true}
                })
            });
    }, [config, engine, pi, refresh, show])

    const onUpdate = async () => {
        try {
            setUpdating(true);
            await updateIndicators(engine, pi, config);
            show({
                message: 'Program indicators updated successfully',
                type: {success: true}
            })
            setRefresh(prevState => !prevState);
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
                        templateUpdated && (
                            <div style={{width: "100%"}}>
                                <NoticeBox warning title={i18n.t("Generic program indicator has updates")}>
                                    <p style={{textAlign: 'justify'}}>{i18n.t("The program indicator used to generate these disaggregations has been updated. Click on update to propagate these changes into the disaggregated program indicators.")}</p>
                                    <Button loading={updating} onClick={onUpdate}
                                            small>{updating ? i18n.t("Updating...") : i18n.t("Update")}</Button>
                                </NoticeBox>
                            </div>
                        )
                    }
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
                              key={`${value.value}-tag`}>{value.operator === "=="? "":value.operator } {value.name}</Tag>)}
                        </div>
                    </div>
                    <div className={classes.footer}>
                    {
                        <div style={{float:"right", paddingRight:"10px"}}><Button onClick={onOpen} icon={<IconAdd24/>}>{i18n.t("Add new")}</Button></div>
                    }
                        <ButtonStrip>
                            <Button
                                onClick={() => setOpenDisaggregationList(true)}>{i18n.t("View disaggregations")}</Button>
                            {
                                openDisaggregationList ? <DisaggregationList open={openDisaggregationList}
                                                                             onClose={() => setOpenDisaggregationList(false)}
                                                                             title={title} config={config}/> : null
                            }
                        </ButtonStrip>
                        <div><Button onClick={() => { setHide(false) }}>{i18n.t("Open dictionary")}</Button></div>
                       <Modal large hide={hide}>
                         <ModalContent>
                            <DictionaryAnalysis dataSources={config.indicators.map(indicator => ({id: indicator.id}))}/>
                        <br/>
                        <div style={{float: "right", paddingRight:"15px" }} onClick={() => { setHide(true) }}>
                            <Button>Hide</Button>
                        </div>
                        </ModalContent>
                       </Modal>
                    </div>
                    { 
                    open && (
                     <DisaggregationForm compound={config} open={open} onClose={() => setOpen(false)}/>
                    )}
                    
                </div>
            </Card>
        </Box>
    )
}
