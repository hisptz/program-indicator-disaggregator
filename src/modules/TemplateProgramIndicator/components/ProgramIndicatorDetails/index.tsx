import i18n from "@dhis2/d2-i18n";
import React from "react";
import { Box, Card } from "@dhis2/ui";
import { ProgramIndicator } from "../../../../shared/interfaces/metadata";
import styles from "./ProgramIndicatorDetails.module.css";
type Props = {
  programIndicator: ProgramIndicator;
};

export default function ProgramIndicatorDetails({
  programIndicator,
}: Props): React.ReactElement {
  return (
    <div style={{ marginTop: "1vh" }} className="w-100">
      <Box height="358px" width="100%">
        <Card>
          <div className={styles["card-container"]}>
            <div className={styles["pi-item"]}>
              <span className={styles.bolded}>{i18n.t("Name")}</span>:{" "}
              {programIndicator.displayName}
            </div>
            <div className={styles["pi-item"]}>
              <span className={styles.bolded}>{i18n.t("Program")}</span>:{" "}
              {programIndicator.program.displayName}
            </div>
            <div className={styles["pi-item"]}>
              <span className={styles.bolded}>{i18n.t("Expression")}</span>:{" "}
              {programIndicator.expression}
            </div>
          </div>
        </Card>
      </Box>
    </div>
  );
}
