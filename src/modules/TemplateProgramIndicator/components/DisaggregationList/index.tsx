import React from 'react'
import {Button, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import {DisaggregationConfig} from "../../../../shared/interfaces";
import {useConfig, useDataQuery} from "@dhis2/app-runtime";
import {find} from "lodash";
import CustomTable from "../../../../shared/components/CustomTable";
import {onPageChange, onPageSizeChange} from "../../../TemplateProgramIndicatorList/services";
import {DateTime} from "luxon";
import {getIndicatorUrl} from "../../../../shared/utils";


const columns = [
    {
        label: i18n.t("Display name"),
        key: "displayName",
    },
    {
        label: i18n.t("Program"),
        key: "program"
    },
    {
        label: i18n.t("Disaggregation value"),
        key: "value"
    },
    {
        label: i18n.t("Last updated"),
        key: "lastUpdated"
    },
    {
        label: "Action",
        key: "action"
    }
]

const indicatorQuery = {
    pis: {
        resource: "programIndicators",
        params: ({ids, page, pageSize}: any) => ({
            filter: `id:in:[${ids.join(",")}]`,
            fields: `id,displayName,program[id,displayName],lastUpdated`,
            totalPages: true,
            page,
            pageSize
        })
    }
}

export default function DisaggregationList({
                                               config,
                                               title,
                                               open,
                                               onClose
                                           }: { config: DisaggregationConfig, title: string, open: boolean, onClose: () => void }): React.ReactElement {

    const indicatorConfigs = config.indicators;
    const {baseUrl} = useConfig();
    const {data, loading, error, refetch} = useDataQuery(indicatorQuery, {
        variables: {
            ids: indicatorConfigs?.map(({id}) => id)
        }
    });


    if (error) {
        return <h3>{error.message}</h3>
    }

    const {programIndicators}: any = data?.pis ?? {};

    const tableData = programIndicators?.map((pi: { displayName: any; program: { displayName: any; }; lastUpdated: string; id: any; }) => {
        const url = getIndicatorUrl(baseUrl, pi.id)
        return {
            displayName: pi.displayName,
            program: pi.program.displayName,
            lastUpdated: DateTime.fromISO(pi.lastUpdated).toFormat("dd-MM-yyyy, HH:mm:ss"),
            value: find(indicatorConfigs, {id: pi.id})?.value,
            action: <a href={url}>{i18n.t("View in maintenance")}</a>
        }
    });

    return (
        <Modal large open={open} position="middle">
            <ModalTitle>{`${title} ${i18n.t("disaggregations")}`}</ModalTitle>
            <ModalContent>
                <div style={{
                    maxHeight: 400
                }} className="w-100">
                    <CustomTable
                        onPageSizeChange={(newPageSize: number) =>
                            onPageSizeChange(newPageSize, refetch)
                        }
                        onPageChange={(newPage: number) => onPageChange(newPage, refetch)}
                        loadingData={loading} columns={columns} tableData={tableData}
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <Button onClick={onClose}>{i18n.t("Hide")}</Button>
            </ModalActions>
        </Modal>
    )
}
