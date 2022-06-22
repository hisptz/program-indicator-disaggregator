import i18n from "@dhis2/d2-i18n";
import React from "react";
import {useDataQuery} from "@dhis2/app-runtime";
import {NoticeBox} from "@dhis2/ui";
import {IndicatorSearch, TemplateIndicatorsTable} from "./components";
import styles from "./TemplateProgramIndicatorList.module.css";
import {useNavigate} from "react-router-dom";
import {
    onFilterIndicator,
    onOpenIndicatorTemplate,
    onPageChange,
    onPageSizeChange,
    onSearchIndicators,
} from "./services";
import {QueryData} from "./interfaces";
import {queryObject} from "./constants";
import {useSavedObjectList} from "@dhis2/app-service-datastore";
import {sanitizeProgramIndicators} from "./utils";
import type {ProgramIndicator} from "@hisptz/dhis2-utils";

export default function TemplateProgramIndicatorList(): React.ReactElement {
    const navigate = useNavigate();
    const {loading, error, data, refetch} = useDataQuery(queryObject, {
        variables: {page: 1, pageSize: 10},
    });
    const [configurations] = useSavedObjectList({global: true});


    if (error) {
        return (
            <NoticeBox error title={i18n.t("Failed to load Program indicators!")}>
                {i18n.t("Refresh the page to reload the indicators.")}
            </NoticeBox>
        );
    }


    const queryData: QueryData =
        (data?.programIndicatorsQuery as QueryData) ?? ({} as QueryData);
    const {programIndicators: rawData, pager: pagination} = queryData;

    const programIndicators = sanitizeProgramIndicators(configurations, rawData as ProgramIndicator[]);


    return (
        <div>
            <h2>{i18n.t("Program Indicators")}</h2>
            <IndicatorSearch
                onFilter={(program) => onFilterIndicator(program, refetch)}
                onSearch={(searchValue) => onSearchIndicators(searchValue, refetch)}
            />
            <div className={styles["table-container"]}>
                <TemplateIndicatorsTable

                    tableData={programIndicators ?? []}
                    loadingData={loading}
                    pagination={pagination ? {
                        ...(pagination as any),
                        onPageChange: (newPage: number) => onPageChange(newPage, refetch),
                        onPageSizeChange: (newPageSize: number) =>
                            onPageSizeChange(newPageSize, refetch)
                    } : undefined}

                    onOpenIndicatorTemplate={onOpenIndicatorTemplate(navigate)}
                />
            </div>
        </div>
    );
}
