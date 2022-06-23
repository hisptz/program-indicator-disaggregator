import React, {useEffect, useRef} from "react";
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
    TableRowHead
} from '@dhis2/ui'
import {Column, CustomTableProps} from "./interfaces";
import {uid} from "@hisptz/dhis2-utils";
import classes from "./CustomTable.module.css";
import {get} from "lodash";


function CustomTableRow({
                            columns,
                            row,
                            onClick,
                            selected
                        }: { onClick: () => void, row: Record<string, any>, columns: Column[], selected?: boolean }) {
    const tableId = useRef(uid());
    const rowRef = uid();

    useEffect(() => {
        if (rowRef) {
            //A hack to get the table row to be clickable
            const row = document.querySelector(`[data-test="${rowRef}-row"]`);
            if (row) {
                row.addEventListener("click", onClick);
            }
        }
    })

    return <TableRow className={selected ? classes['row-selected'] : classes.row} dataTest={`${rowRef}-row`}
                     onClick={onClick}>
        {columns.map(({key, mapperFn}) => (
            <TableCell key={`${tableId.current}-${key}-column`}>{mapperFn ? mapperFn(row) : get(row, key)}</TableCell>
        ))}
    </TableRow>;
}

export default function CustomTable({
                                        columns,
                                        data,
                                        pagination,
                                        onRowClick,
                                        selectedRows,
                                        loading,
                                        suppressZebraStripping
                                    }: CustomTableProps): React.ReactElement {
    const tableId = useRef(uid());
    return (
        <Table suppressZebraStripping={suppressZebraStripping}>
            <TableHead>
                <TableRowHead>
                    {
                        columns.map(({key, label}) => (
                            <TableCellHead dataTest={`${label}-column`}
                                           key={`${tableId.current}-${key}-column-header`}>{label}</TableCellHead>
                        ))
                    }
                </TableRowHead>
            </TableHead>
            <TableBody>
                {
                    loading ? (
                            <>
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
                            </>
                        ) :
                        data.map((row, index) => (
                            <CustomTableRow
                                selected={selectedRows?.includes(index)}
                                key={`${tableId.current}-${index}-row`}
                                onClick={() => onRowClick ? onRowClick(row) : null}
                                row={row} columns={columns}
                            />
                        ))
                }
            </TableBody>
            {
                pagination ? <TableFoot>
                    <TableRow>
                        <TableCell colSpan={`${columns.length}`}>
                            <Pagination {...pagination} hidePageSizeSelect={(!pagination.onPageSizeChange)}/>
                        </TableCell>
                    </TableRow>
                </TableFoot> : null
            }
        </Table>
    )
}
