import i18n from "@dhis2/d2-i18n";
import React from "react";

import {
  Table,
  Pagination,
  CircularLoader,
  TableHead,
  TableBody,
  TableFoot,
  TableRowHead,
  TableCellHead,
  TableRow,
  TableCell,
  IconCheckmark24,
} from "@dhis2/ui";
import { ProgramIndicator } from "../../../../shared/interfaces/metadata";
import { Pagination as Pager } from "../../../../shared/interfaces/pagination";
import { getSanitizedDateString } from "../../../../shared/utils";

// property type
type Props = {
  pagination?: Pager;
  loadingData: boolean;
  tableData: ProgramIndicator[];
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onOpenIndicatorTemplate: (indicator: ProgramIndicator) => void;
};

const defaultPagination: Pager = {
  page: 1,
  pageSize: 10,
};

export default function TemplateIndicatorsTable({
  pagination = defaultPagination,
  tableData = [],
  onPageChange,
  onPageSizeChange,
  onOpenIndicatorTemplate,
  loadingData,
}: Props): React.ReactElement {
  return (
    <div>
      <Table suppressZebraStriping>
        <TableHead>
          <TableRowHead>
            <TableCellHead>{i18n.t("Name")}</TableCellHead>
            <TableCellHead>{i18n.t("Program")}</TableCellHead>
            <TableCellHead>{i18n.t("Last Updated")}</TableCellHead>
            <TableCellHead>{i18n.t("Disaggregated")}</TableCellHead>
          </TableRowHead>
        </TableHead>
        {loadingData ? (
          <>
            <TableBody>
              <TableRow>
                <TableCell colSpan="12">
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 500,
                    }}
                  >
                    <CircularLoader small />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        ) : (
          <TableBody>
            {tableData.map((indicator) => (
              <TableRow key={indicator.id}>
                <TableCell>
                  <div onClick={() => onOpenIndicatorTemplate(indicator)}>
                    {indicator.displayName}
                  </div>
                </TableCell>
                <TableCell>
                  <div onClick={() => onOpenIndicatorTemplate(indicator)}>
                    {indicator.program.displayName}
                  </div>
                </TableCell>
                <TableCell>
                  <div onClick={() => onOpenIndicatorTemplate(indicator)}>
                    {getSanitizedDateString(indicator.lastUpdated ?? "")}
                  </div>
                </TableCell>
                <TableCell>
                  <div onClick={() => onOpenIndicatorTemplate(indicator)}>
                    {indicator.disaggregated ? <IconCheckmark24 /> : ""}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
        <TableFoot>
          <TableRow>
            <TableCell colSpan="4">
              {pagination && (
                <Pagination
                  {...pagination}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              )}
            </TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    </div>
  );
}
