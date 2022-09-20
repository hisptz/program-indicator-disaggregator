export interface ProgramIndicator extends DHIS2Resource {
    program: Program;
    programIndicatorGroups: { id: string }[];
    analyticsPeriodBoundaries: AnalyticsPeriodBoundaries[];
}

export interface DataElement extends DHIS2Resource {
    valueType: DHIS2ValueType;
    optionSet?: OptionSet;
    legendSets?: LegendSet[];
    dataElementGroups?: { id: string; }[];
}

export interface Option extends DHIS2Resource {
    code: string;
    legendSets?: LegendSet[];
    sortOrder?: number;
    optionSet?: OptionSet;
}

export interface OptionSet extends DHIS2Resource {
    options?: Option[];
    valueType?: DHIS2ValueType;
}

export interface Program extends DHIS2Resource {
    trackedEntityType?: TrackedEntityType;
    programType?: string;
    programStages?: ProgramStage[];
    programTrackedEntityAttributes?: {
        trackedEntityAttribute: TrackedEntityAttribute;
        program: Program,
        id: string,
        displayName: string
    }[];
}


export interface Variable {id: string, displayName:string, valueType: string, optionSet?: OptionSet;}


export interface TrackedEntityAttribute extends DHIS2Resource {
    valueType?: DHIS2ValueType;
    optionSet?: OptionSet;
    legendSets?: LegendSet[];
    attributeValues?: { value: string, attribute: { id: string } }[];
}

export type TrackedEntityType = DHIS2Resource


export interface DHIS2Resource {
    id: string;
    displayName?: string;
    shortName?: string;
    name?: string;
    code?: string;
    href?: string;
    lastUpdated?: string;
    created?: string;
    sharing?: string;
    translations?: any[];

    [key: string]: any;
}

export type DHIS2AccessString = "rw------" | "r-------" | "-------" | "rwrw----"

export type DHIS2ValueType = "LONG_TEXT" | "TEXT" | "BOOLEAN" | "DATE" | "AGE" | "NUMBER"

export type ProgramType = "WITH_REGISTRATION" | "WITHOUT_REGISTRATION"


export interface DHIS2Access {
    read?: boolean;
    write?: boolean;
    delete?: boolean;
    externalize?: boolean;
    manage?: boolean;
    update?: boolean;
}

export interface DHIS2Sharing {
    owner: string;
    external: boolean;
    public: DHIS2AccessString;
    users: {
        [key: string]: DHIS2AccessString;
    };
    userGroups: {
        [key: string]: DHIS2AccessString;
    };
}

export interface ProgramStageSection {
    displayFormName?: string;
    sortOrder?: number;
    programStage?: ProgramStage;
    dataElements?: DataElement[];
    programIndicators?: ProgramIndicator[];
}

export interface ProgramStageDataElements {
    dataElement: DataElement;
    compulsory?: boolean;
    allowProvidedElsewhere?: boolean;
    displayInReports?: boolean;
    sortOrder?: number;
    programStageSection: ProgramStageSection;
    programStage?: ProgramStage;
}

export interface ProgramStage extends DHIS2Resource {
    program?: Program;
    programStageDataElements?: ProgramStageDataElements[];
    programStageSections?: ProgramStageSection[];
    repeatable?: boolean;
}

export interface Legend extends DHIS2Resource {
    startValue: number;
    endValue: number;
    color: string;


}

export interface LegendSet extends DHIS2Resource {
    id: string;
    name: string;
    legends: Legend[];
}


export interface AnalyticsPeriodBoundaries extends DHIS2Resource {
    boundaryTarget?: string;
    analyticsPeriodBoundaryType?: string;
}

