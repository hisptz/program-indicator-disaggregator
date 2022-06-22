import i18n from "@dhis2/d2-i18n";
import React from "react";
import {IconCheckmark16} from '@dhis2/ui'
import {ProgramIndicator} from "../../../../shared/interfaces/metadata";
import {Column, Pagination as Pager} from "../../../../shared/components/CustomTable/interfaces";
import CustomTable from "../../../../shared/components/CustomTable";
import {DateTime} from "luxon";

// property type
type Props = {
    pagination?: Pager;
    loadingData: boolean;
    tableData: ProgramIndicator[];
    onOpenIndicatorTemplate: (indicator: ProgramIndicator) => void;
};

const defaultPagination: Pager = {
    page: 1,
    pageSize: 10,
    total: 0,

};


const columns: Column[] = [
    {
        label: i18n.t("Name"),
        key: "displayName",
    },
    {
        label: i18n.t("Program"),
        key: "program.displayName"
    },
    {
        label: i18n.t("Last Updated"),
        key: "lastUpdated",
        mapperFn: (row: ProgramIndicator) => {
            return DateTime.fromISO(row.lastUpdated as string).toFormat("dd-MM-yyyy");
        }
    },
    {
        label: i18n.t("Disaggregated"),
        key: "disaggregated",
        mapperFn: (row: any) => {
            return row?.disaggregated ? <IconCheckmark16/> : null;
        }
    }
]


export default function TemplateIndicatorsTable({
                                                    pagination = defaultPagination,
                                                    tableData = [],
                                                    onOpenIndicatorTemplate,
                                                    loadingData,
                                                }: Props): React.ReactElement {
    return (
        <>

            <CustomTable
                pagination={pagination}
                columns={columns}
                data={tableData}
                loading={loadingData}
                onRowClick={(indicator: ProgramIndicator) => onOpenIndicatorTemplate(indicator)}
            />

        </>
    );
}
