import {compact} from "lodash";

export const queryObject = {
    programIndicatorsQuery: {
        resource: "programIndicators",
        params: ({page, pageSize, identifiable, program}: any) => ({
            filter: compact([
                identifiable ? `identifiable:token:${identifiable || " "}` : undefined,
                program ? `program.id:eq:${program ?? ""}` : undefined
            ]),
            fields: ["id", "displayName", "lastUpdated", "program[id,displayName]"],
            page: page ?? 1,
            pageSize: pageSize ?? 10,
        }),
    },
};
