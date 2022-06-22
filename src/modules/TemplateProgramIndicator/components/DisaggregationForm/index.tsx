import React, {useEffect} from 'react';
import {Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n';
import Form from "./components/Form";
import {FormProvider, useForm} from "react-hook-form";
import {DisaggregationConfig} from "../../../../shared/interfaces";
import {useManageProgramIndicatorTemplate} from "../../hooks";
import {useSelectedProgramIndicator} from "../../../../shared/hooks";
import {DevTool} from "@hookform/devtools";
import {validateNameLength} from "../../../../shared/utils";
import {uid} from "@hisptz/dhis2-utils";


export default function DisaggregationForm({
                                               open,
                                               onClose,
                                               disaggregationConfigId,
                                           }: { open: boolean, onClose: () => void, disaggregationConfigId?: string }): React.ReactElement {

    const {error, loading, pi} = useSelectedProgramIndicator();
    const {save, saving, config, uploading, progress, count} = useManageProgramIndicatorTemplate(pi);
    const defaultValues = config?.disaggregationConfigs?.find(dc => dc.id === disaggregationConfigId);
    const form = useForm<DisaggregationConfig>();

    useEffect(() => {
        form.reset(defaultValues);
        return () => {
            form.reset();
        };
    }, [defaultValues, form]);

    const onFormSubmit = async (data: DisaggregationConfig) => {
        const {valid, valuesWithExtraChars} = validateNameLength(data, pi);
        if (valid) {
            const isSuccess = await save({...data, id: disaggregationConfigId ?? `${data.data}.${uid()}`});
            if (isSuccess) {
                onClose();
            }
        } else {
            const chars = (50 - (pi?.shortName?.length ?? 0));
            const value = valuesWithExtraChars?.join(", ");
            form.setError("nameTemplate", {
                message: i18n.t("Name prefix must be less than {{ chars }} characters for all values. {{ value }} exceed(s) this limit.", {
                    chars,
                    value
                })
            }, {shouldFocus: true});
        }
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
                    <Button loading={saving || uploading} onClick={form.handleSubmit(onFormSubmit)}
                            primary>{uploading ? `${i18n.t("Creating...")} (${progress}/${count})` : saving ? i18n.t("Saving configuration...") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )

}
