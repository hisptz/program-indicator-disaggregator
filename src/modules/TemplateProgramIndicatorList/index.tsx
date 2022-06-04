import React from "react";
import { ProgramIndicator } from "../../shared/interfaces/metadata";
import { useDataQuery } from "@dhis2/app-runtime";

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
    return <div>Error!</div>;
  }

  const queryData: {
    programIndicators?: ProgramIndicator[];
    pager?: Pagination;
  } = data?.programIndicatorsQuery ?? {};
  const { programIndicators, pager: pagination } = queryData;

  return (
    <>
      <h1>Template indicator list</h1>
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
    </>
  );
}
