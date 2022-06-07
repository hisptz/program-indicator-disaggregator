import i18n from '@dhis2/d2-i18n'


export enum DATA_TYPES {
    'DATA_ELEMENT' = 'DATA_ELEMENT',
    'TRACKED_ENTITY_ATTRIBUTE' = 'TRACKED_ENTITY_ATTRIBUTE',
}

export enum DISAGGREGATION_TYPES {
    OPTION_SET = "OPTION_SET",
    CUSTOM_VALUE = "CUSTOM_VALUE",
}

export const SUPPORTED_VALUE_TYPES = [
    "NUMBER",
    "TEXT"
]

export const DISAGGREGATION_TYPES_OPTIONS = [
    {
        label: i18n.t("Option set"),
        value: DISAGGREGATION_TYPES.OPTION_SET,
    },
    {
        label: i18n.t("Custom value"),
        value: DISAGGREGATION_TYPES.CUSTOM_VALUE,
    }
];

export enum PROGRAM_TYPES {
    WITH_REGISTRATION = "WITH_REGISTRATION",
    WITHOUT_REGISTRATION = "WITHOUT_REGISTRATION"
}

export const PROGRAM_INDICATOR_QUERY = {
    programIndicator: {
        resource: `programIndicators`,
        id: ({id}: any): string => id,
        params: {
            fields: [
                "id",
                "name",
                "shortName",
                "displayName",
                "description",
                "aggregationType",
                "displayInForm",
                "publicAccess",
                "displayDescription",
                "displayShortName",
                "displayFormName",
                "filter",
                "analyticsType",
                "favorite",
                "dimensionItemType",
                "access",
                "sharing",
                "favorites",
                "programIndicatorGroups[id]",
                "analyticsPeriodBoundaries[access,analyticsPeriodBoundaryType,attributeValues,boundaryTarget,created,externalAccess,favorite,favorites,lastUpdated,sharing,translations,userAccesses,userGroupAccesses]",
                "userGroupAccesses",
                "attributeValues",
                "userAccesses",
                "legendSets[id]",
                "createdBy[id]",
                "lastUpdatedBy[id]",
                "expression",
                "program[id,programType,displayName,programStages[id,displayName,programStageDataElements[id,dataElement[id,displayName,valueType,optionSet[id,displayName,options[id,displayName,code]]]]],programTrackedEntityAttributes[id,displayName,trackedEntityAttribute[id,displayName,valueType,optionSet[id,displayName,options[id,displayName,code]]]]]",
            ]
        }
    }
}


export const PROGRAM_INDICATOR_SCHEMA_MUTATION = {
    type: "create",
    resource: "schema/programIndicator",
    data: ({data}: any): any => data
}

export const PROGRAM_INDICATOR_MUTATION = {
    type: "create",
    resource: "programIndicators",
    data: ({data}: any): any => data
}
