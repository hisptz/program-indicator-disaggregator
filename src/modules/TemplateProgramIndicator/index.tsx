import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, CircularLoader, Divider, IconAdd24} from "@dhis2/ui";
import DisaggregationForm from "./components/DisaggregationForm";
import i18n from "@dhis2/d2-i18n";
import ProgramIndicatorDetails from "./components/ProgramIndicatorDetails";
import {useSelectedProgramIndicator} from "../../shared/hooks";
import {useProgramIndicatorTemplate} from "./hooks";
import {isEmpty} from "lodash";
import DisaggregationConfigList from "./components/DisaggregationConfigList";

export default function TemplateProgramIndicator(): React.ReactElement {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {pi, error, loading} = useSelectedProgramIndicator();
    const config = useProgramIndicatorTemplate();
    const onOpen = () => setOpen((prevState) => !prevState)
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

    const configurationsEmpty = isEmpty(config?.disaggregationConfigs);
    return (
        <div style={{marginBottom: 32}} className="container-fluid w-100">
            <div className="row-gap-16 space-between">
                <Button onClick={() => navigate("/")}>{i18n.t("Back")}</Button>
            </div>
            <div className="row-gap-16">
                <ProgramIndicatorDetails programIndicator={pi}/>
            </div>
            <div className="col">
                <div className="w-100">
                    <div className="row-gap-16 space-between align-middle">
                        <h3>{i18n.t("Disaggregation configurations")}</h3>
                        {
                            !configurationsEmpty ? <Button icon={<IconAdd24/>} primary onClick={onOpen}>
                                {i18n.t("Add new")}
                            </Button> : null
                        }
                    </div>
                    <Divider/>
                    {
                        !configurationsEmpty ?
                            <DisaggregationConfigList pi={pi} configs={config.disaggregationConfigs}/> : null
                    }
                    {
                        configurationsEmpty ?
                            <div style={{minHeight: 300}} className="h-100 w-100 col align-middle center flex-1 ">
                                <h2 style={{color: "#4A5768"}}>{i18n.t("Start by adding a new disaggregation configuration")}</h2>
                                <Button icon={<IconAdd24/>} onClick={onOpen}>{i18n.t("Add new")}</Button>
                            </div> : null
                    }
                </div>
            </div>
            {open && (
                <DisaggregationForm open={open} onClose={() => setOpen(false)}/>
            )}
        </div>
    );
}
