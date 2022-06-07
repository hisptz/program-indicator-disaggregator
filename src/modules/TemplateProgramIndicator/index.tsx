import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, CircularLoader, Divider, IconAdd24} from "@dhis2/ui";
import DisaggregationForm from "./components/DisaggregationForm";
import i18n from "@dhis2/d2-i18n";

import ProgramIndicatorDetails from "./components/ProgramIndicatorDetails";
import {useSelectedProgramIndicator} from "../../shared/hooks";
import {useProgramIndicatorTemplate} from "./hooks";
import DisaggregationConfig from "./components/DisaggregationConfig";

export default function TemplateProgramIndicator(): React.ReactElement {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {pi, error, loading} = useSelectedProgramIndicator();
    const config = useProgramIndicatorTemplate();

    if (loading) {
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularLoader small/>
            </div>
        );
    }

    if (error) {
        return <h3>{error.message}</h3>;
    }
    return (
        <div className="container-fluid h-100 w-100">
            <div className="row-gap-16 space-between">
                <Button onClick={() => navigate("/")}>{i18n.t("Back")}</Button>
            </div>
            <div className="row-gap-16">
                <ProgramIndicatorDetails programIndicator={pi}/>
            </div>
            <div>
                <div className="w-100">
                    <div className="row-gap-16 space-between align-middle">
                        <h3>{i18n.t("Disaggregation configurations")}</h3>
                        <Button icon={<IconAdd24/>} primary onClick={() => setOpen((prevState) => !prevState)}>
                            {i18n.t("Add new")}
                        </Button>
                    </div>
                    <Divider/>
                    <div className="w-100 col gap-32">
                        {
                            config?.disaggregationConfigs?.map(disaggregationConfig => <DisaggregationConfig pi={pi}
                                                                                                             key={`${disaggregationConfig.id}-list`}
                                                                                                             config={disaggregationConfig}/>)
                        }
                    </div>
                </div>
            </div>
            {open && (
                <DisaggregationForm open={open} onClose={() => setOpen(false)}/>
            )}
        </div>
    );
}
