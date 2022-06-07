import React from "react";
import {Pagination as Pager} from "../../interfaces/pagination"
import {
    CircularLoader,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableFoot,
    TableHead,
    TableRow,
    TableRowHead,
} from "@dhis2/ui";
// property type
type Props = {
    pagination?: Pager;
    loadingData: boolean;
    tableData: Record<string, any>[];
    columns: Record<string, string>[]
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
};

const defaultPagination: Pager = {
    page: 1,
    pageSize: 10,
};

export default function CustomTable({
                                        pagination = defaultPagination,
                                        tableData = [],
                                        columns,
                                        onPageChange,
                                        onPageSizeChange,
                                        loadingData,
                                    }: Props): React.ReactElement {
    return (
        <div>
            <Table>
                <TableHead>
                    <TableRowHead>
                        {
                            columns.map(({label, key}) => (
                                <TableCellHead key={`${key}-key`}>{label}</TableCellHead>
                            ))
                        }
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
                                        <CircularLoader small/>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                ) : (
                    <TableBody>
                        {tableData.map((data, index) => (
                            <TableRow key={`${index}-row`}>
                                {
                                    columns.map(({key}) => (<TableCell key={`${key}-${index}`}>
                                        {data[key]}
                                    </TableCell>))
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                )}
                <TableFoot>
                    <TableRow>
                        <TableCell colSpan={columns.length}>
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
