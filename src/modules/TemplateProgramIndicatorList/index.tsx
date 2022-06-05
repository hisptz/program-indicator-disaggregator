import i18n from "@dhis2/d2-i18n";
import React from "react";
import {useDataQuery} from "@dhis2/app-runtime";
import {NoticeBox} from "@dhis2/ui";
import {IndicatorSearch, TemplateIndicatorsTable} from "./components";
import styles from "./TemplateProgramIndicatorList.module.css";
import {useNavigate} from "react-router-dom";
import {onOpenIndicatorTemplate, onPageChange, onPageSizeChange, onSearchIndicators} from "./services";
import {QueryData} from "./interfaces";
import {queryObject} from "./constants";

export default function TemplateProgramIndicatorList(): React.ReactElement {
    const navigate = useNavigate();
    const {loading, error, data, refetch} = useDataQuery(queryObject, {
        variables: {page: 1, pageSize: 10},
    });

    if (error) {
        return (
            <NoticeBox error title={i18n.t("F   ailed to load Program indicators!")}>
                {i18n.t("Refresh the page to reload the indicators.")}
            </NoticeBox>
        );
    }

    const queryData: QueryData = data?.programIndicatorsQuery as QueryData ?? {} as QueryData;
    const {programIndicators, pager: pagination} = queryData;

    return (
        <div>
            <h2>{i18n.t("Template Program Indicator list")}</h2>
            <IndicatorSearch
                onSearch={(searchValue) => onSearchIndicators(searchValue, refetch)}
            />
            <div className={styles["table-container"]}>
                <TemplateIndicatorsTable
                    tableData={programIndicators ?? []}
                    loadingData={loading}
                    pagination={pagination}
                    onPageChange={(newPage: number) => onPageChange(newPage, refetch)}
                    onPageSizeChange={(newPageSize: number) =>
                        onPageSizeChange(newPageSize, refetch)
                    }
                    onOpenIndicatorTemplate={onOpenIndicatorTemplate(navigate)}
                />
            </div>
        </div>
    );
}
