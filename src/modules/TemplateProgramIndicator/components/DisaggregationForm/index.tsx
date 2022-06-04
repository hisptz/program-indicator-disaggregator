import React from 'react';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n';
import Form from "./components/Form";
import {FormProvider, useForm} from "react-hook-form";


export default function DisaggregationForm({
                                               open,
                                               onClose,
                                           }: { open: boolean, onClose: () => void }): React.ReactElement {

    const form = useForm();

    const onFormSubmit = (data: any) => {
        // eslint-disable-next-line no-console
        console.table(data);
    }

    return (
        <Modal position="middle" open={open} onClose={onClose}>
            <ModalTitle>
                {i18n.t("Create new disaggregation")}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <Form/>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button onClick={form.handleSubmit(onFormSubmit)} primary>{i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )

}
