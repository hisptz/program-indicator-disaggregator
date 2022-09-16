import React from "react";
import {ProgramIndicator} from "../../../../shared/interfaces/metadata";
import i18n from '@dhis2/d2-i18n'
import classes from "./ProgramIndicatorDetails.module.css"
import {useConfig} from "@dhis2/app-runtime";
import {getIndicatorUrl} from "../../../../shared/utils";

type Props = {
    programIndicator: ProgramIndicator;
};

export default function ProgramIndicatorDetails({
                                                    programIndicator,
                                                }: Props): React.ReactElement {
    const {baseUrl} = useConfig();
    const url = getIndicatorUrl(baseUrl, programIndicator.id);
    return (
        <div style={{paddingTop: "1vh", paddingBottom: "3vh"}} className="w-100">
            <h1>
                {programIndicator.displayName}
            </h1>
            <div className="col gap-16">
                <div className={classes.data}><label>{i18n.t("Program")}: </label>{programIndicator.program.displayName}
                </div>
                <div className={classes.data}>
                    <label>{i18n.t("Expression")}: </label><code>{programIndicator.expression}</code>
                </div>
                <div className={classes.data}>
                    <label>{i18n.t("Filter")}: </label><code>{programIndicator.filter ?? i18n.t("No filters")}</code>
                </div>
                <div className={classes.data}>
                    <label>{i18n.t("Description")}: </label><span>{programIndicator.program?.description
                    ?? i18n.t("No description provided")}</span>
                </div>
                <a href={`${url}`} target="_blank" referrerPolicy="no-referrer"
                   rel="noreferrer">{i18n.t("View in maintenance")}</a>
                <a style={{textAlign:"right"
                   }} href="/" target="_blank">{i18n.t("Open Dictionary")}</a>   
            </div>
        </div>
    );
}
