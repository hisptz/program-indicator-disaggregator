import React from "react";
import { ProgramIndicator } from "../../shared/interfaces/metadata";

import { TemplateIndicatorsTable } from "./components";

// TODO clear these with dynamic fetching
import query from "./constants/data.trial.json";
const programIndicatorQuery = query["programIndicatorsQuery"];
const programIndicatorList: ProgramIndicator[] =
  programIndicatorQuery?.programIndicators ?? [];
const pagination = programIndicatorQuery?.pager ?? {};

const onPageChange = (newPage: number) => {
  console.log("onPageChange", newPage);
};

const onPageSizeChange = (newPageSize: number) => {
  console.log("onPageSizeChange", newPageSize);
};

export default function TemplateProgramIndicatorList(): React.ReactElement {
  return (
    <>
      <h1>Template indicator list</h1>
      <TemplateIndicatorsTable
        tableData={programIndicatorList}
        loadingData={false}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      ></TemplateIndicatorsTable>
    </>
  );
}
