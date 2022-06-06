import React, {useEffect} from 'react';
import {Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n';
import Form from "./components/Form";
import {FormProvider, useForm} from "react-hook-form";
import {DisaggregationConfig} from "../../../../shared/interfaces";
import {useDisaggregationConfig} from "../../hooks";
import {useSelectedProgramIndicator} from "../../../../shared/hooks";
import {DevTool} from "@hookform/devtools";
import {uid} from "@hisptz/dhis2-utils";


export default function DisaggregationForm({
                                               open,
                                               onClose,
                                               disaggregationConfigId,
                                           }: { open: boolean, onClose: () => void, disaggregationConfigId?: string }): React.ReactElement {

    const {error, loading, pi} = useSelectedProgramIndicator();
    const {save, saving, config} = useDisaggregationConfig(pi);
    const defaultValues = config?.disaggregationConfigs?.find(dc => dc.id === disaggregationConfigId);
    const form = useForm<DisaggregationConfig>();

    useEffect(() => {
        form.reset(defaultValues);
        return () => {
            form.reset();
        };
    }, [defaultValues, form]);

    const onFormSubmit = (data: DisaggregationConfig) => {
        save({...data, id: disaggregationConfigId ?? `${data.data}.${uid()}`});
    }

    if (loading) {
        return <div style={{
            height: "100%",
            width: "100%",
            minHeight: 500,
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
        <Modal position="middle" open={open} onClose={onClose}>
            <ModalTitle>
                {i18n.t("Create new disaggregation")}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <Form pi={pi}/>
                    <DevTool/>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button loading={saving} onClick={form.handleSubmit(onFormSubmit)}
                            primary>{saving ? i18n.t("Saving...") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )

}
