import React, {useState} from 'react'
import {DisaggregationConfig as DisaggregationConfigType} from "../../../../shared/interfaces";
import {chunk, get} from "lodash";
import DisaggregationConfig from '../DisaggregationConfig';
import type {ProgramIndicator} from "@hisptz/dhis2-utils";
import {Pagination} from '@dhis2/ui'

export default function DisaggregationConfigList({
                                                     configs,
                                                     pi
                                                 }: { pi: ProgramIndicator, configs: DisaggregationConfigType[] }): React.ReactElement {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const dataChunks = chunk(configs, pageSize);
    const hasMoreThanOnePage = dataChunks.length > 1;
    const pagedData = get(dataChunks, [page - 1])

    const onPageChange = (page: number) => setPage(page);
    const onPageSizeChange = (pageSize: number) => setPageSize(pageSize);


    return (
        <div className="col gap-32 w-100">
            {
                pagedData?.map((config: DisaggregationConfigType) => <DisaggregationConfig pi={pi}
                                                                                           key={`${config.id}-list`}
                                                                                           config={config}/>)}
            {
                hasMoreThanOnePage && <Pagination
                    page={page}
                    pageSize={pageSize}
                    pageCount={dataChunks.length}
                    total={configs.length}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            }
        </div>
    )
}
