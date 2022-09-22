import {DataElement, ProgramIndicator, TrackedEntityAttribute, Variable} from "../../../../../../../shared/interfaces/metadata";
import {DATA_TYPES, VARIABLE_CONST} from "../../../../../../../shared/constants";

export function getSelectedData(pi: ProgramIndicator, data: string, dataType: string): DataElement | TrackedEntityAttribute | Variable| undefined {
    if (dataType === DATA_TYPES.DATA_ELEMENT) {
        const programStage = pi.program.programStages?.find(ps => ps.programStageDataElements?.find(psde => psde.dataElement.id === data));
        return programStage?.programStageDataElements?.find(psde => psde.dataElement.id === data)?.dataElement;
    }

    if (dataType === DATA_TYPES.TRACKED_ENTITY_ATTRIBUTE) {
        return pi.program.programTrackedEntityAttributes?.find(pta => pta.trackedEntityAttribute.id === data)?.trackedEntityAttribute;
    }

    if (dataType === DATA_TYPES.VARIABLE){
        return VARIABLE_CONST.find(pv => pv.id === data);
    }
}
