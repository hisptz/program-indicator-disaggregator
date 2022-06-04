import i18n from '@dhis2/d2-i18n'

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
                "displayName",
                "program[id,programType,displayName,programStages[id,displayName,programStageDataElements[id,dataElement[id,displayName,valueType,optionSet[id,displayName,options[id,displayName,code]]]]],programTrackedEntityAttributes[id,displayName,trackedEntityAttribute[id,displayName,valueType,optionSet[id,displayName,options[id,displayName,code]]]]]",
            ]
        }
    }
}
