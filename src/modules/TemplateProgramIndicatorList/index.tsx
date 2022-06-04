import i18n from "@dhis2/d2-i18n";
import React from "react";
import { ProgramIndicator } from "../../shared/interfaces/metadata";
import { useDataQuery } from "@dhis2/app-runtime";
import { NoticeBox } from "@dhis2/ui";
import { TemplateIndicatorsTable } from "./components";
import { Pagination } from "../../shared/interfaces/pagination";
const queryObject = {
  programIndicatorsQuery: {
    resource: "programIndicators",
    params: ({ page, pageSize }: any) => ({
      fields: ["id", "displayName", "lastUpdated", "program[id,displayName]"],
      page: page ?? 1,
      pageSize: pageSize ?? 10,
    }),
  },
};

const onPageChange = (newPage: number, refetch: any) => {
  refetch({ page: newPage });
};

const onPageSizeChange = (newPageSize: number, refetch: any) => {
  refetch({ pageSize: newPageSize });
};

const onOpenIndicatorTemplate = (indicator: ProgramIndicator) => {
  //  TODO: open indicator template
};

export default function TemplateProgramIndicatorList(): React.ReactElement {
  const { loading, error, data, refetch } = useDataQuery(queryObject, {
    variables: { page: 1, pageSize: 10 },
  });

  if (error) {
    return (
      <NoticeBox error title={i18n.t("Failed to load Program indicators!")}>
        {i18n.t("Refresh the page to reload the indicators.")}
      </NoticeBox>
    );
  }

  const queryData: {
    programIndicators?: ProgramIndicator[];
    pager?: Pagination;
  } = data?.programIndicatorsQuery ?? {};
  const { programIndicators, pager: pagination } = queryData;

  return (
    <div className="container">
      <h2>{i18n.t("Template Program Indicator list")}</h2>
      <TemplateIndicatorsTable
        tableData={programIndicators ?? []}
        loadingData={loading}
        pagination={pagination}
        onPageChange={(newPage: number) => onPageChange(newPage, refetch)}
        onPageSizeChange={(newPageSize: number) =>
          onPageSizeChange(newPageSize, refetch)
        }
        onOpenIndicatorTemplate={onOpenIndicatorTemplate}
      ></TemplateIndicatorsTable>
    </div>
  );
}
