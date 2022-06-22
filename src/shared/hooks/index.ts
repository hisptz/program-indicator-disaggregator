import {useParams} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {PROGRAM_INDICATOR_QUERY} from "../constants";
import {ProgramIndicator} from "../interfaces/metadata";


export function useSelectedProgramIndicator(): { loading: boolean; pi: ProgramIndicator; error: any } {
    const {id} = useParams<{ id: string }>();
    const {loading, data, error} = useDataQuery(PROGRAM_INDICATOR_QUERY, {variables: {id}});

    const pi = data?.programIndicator as ProgramIndicator;

    return {
        loading,
        pi,
        error
    }
}
