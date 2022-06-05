export const queryObject = {
    programIndicatorsQuery: {
        resource: "programIndicators",
        params: ({page, pageSize, identifiable}: any) => ({
            fields: ["id", "displayName", "lastUpdated", "program[id,displayName]"],
            filter: `identifiable:token:${identifiable || " "}`,
            page: page ?? 1,
            pageSize: pageSize ?? 10,
        }),
    },
};
