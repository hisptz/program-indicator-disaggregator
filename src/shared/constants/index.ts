import i18n from "@dhis2/d2-i18n";
import {Variable} from "../interfaces/metadata";

export enum DATA_TYPES {
    'DATA_ELEMENT' = 'DATA_ELEMENT',
    'TRACKED_ENTITY_ATTRIBUTE' = 'TRACKED_ENTITY_ATTRIBUTE',
    'VARIABLE' = 'VARIABLE',
    'CONSTANT' = 'CONSTANT',
}

export enum DISAGGREGATION_TYPES {
    OPTION_SET = "OPTION_SET",
    CUSTOM_VALUE = "CUSTOM_VALUE",
    CONSTANT_VALUE = "CONSTANT_VALUE",
}

export enum VALUE_TYPES {
    TEXT = 'TEXT',
    DATE = 'DATE',
    NUMBER = 'NUMBER'
}

export const SUPPORTED_VALUE_TYPES = ["NUMBER", "TEXT", "DATE"];

export const DISAGGREGATION_TYPES_OPTIONS = [
    {
        label: i18n.t("Option set"),
        value: DISAGGREGATION_TYPES.OPTION_SET,
    },
    {
        label: i18n.t("Custom value"),
        value: DISAGGREGATION_TYPES.CUSTOM_VALUE,
    },
    {
        label: i18n.t("Constant"),
        value: DISAGGREGATION_TYPES.CONSTANT_VALUE,
    },
];

export enum PROGRAM_TYPES {
    WITH_REGISTRATION = "WITH_REGISTRATION",
    WITHOUT_REGISTRATION = "WITHOUT_REGISTRATION",
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
                "lastUpdated",
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

export const PROGRAM_INDICATOR_UPDATE_MUTATION = {
    type: "update",
    resource: "programIndicators",
    id: ({id}: any): string => id,
    data: ({data}: any): any => data
}

export const VARIABLE_CONST: Array<Variable> = [
    {
        displayName: i18n.t("Completed date"),
        id: 'completed_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Creation date"),
        id: 'creation_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Current date"),
        id: 'current_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Due date"),
        id: 'due_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Enrollment date"),
        id: 'enrollment_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Event date"),
        id: 'event_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Incident date"),
        id: 'Incident_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Program stage id"),
        id: 'program_stage_id',
        valueType: "TEXT"
    },
    {
        displayName: i18n.t("Program stage name"),
        id: 'program_stage_name',
        valueType: "TEXT"
    },
    {
        displayName: i18n.t("Sync date"),
        id: 'sync_date',
        valueType: "DATE"
    },
    {
        displayName: i18n.t("Value count"),
        id: 'value_count',
        valueType: "NUMBER"
    },
    {
        displayName: i18n.t("Zero or positive value count"),
        id: 'zero_or_positive_value_count',
        valueType: "NUMBER"
    }
];

export const queryResponse = {
    "constantsQuery": {
        "resource": "constants",
        "params": {
            "fields": [
                "id",
                "displayName"
            ],
        }
    }
}
