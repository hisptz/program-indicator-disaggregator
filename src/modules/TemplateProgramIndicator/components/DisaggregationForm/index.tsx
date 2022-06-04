import React from 'react';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n';
import Form from "./components/Form";


export default function DisaggregationForm({
                                               open,
                                               onClose
                                           }: { open: boolean, onClose: () => void }): React.ReactElement {

    return (
        <Modal position="middle" open={open} onClose={onClose}>
            <ModalTitle>
                {i18n.t("Create new disaggregation")}
            </ModalTitle>
            <ModalContent>
                <Form/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button primary>{i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )

}
