import i18n from "@dhis2/d2-i18n";
import React from "react";
import { InputField } from "@dhis2/ui";

const { useState } = React;

export default function IndicatorSearch(): React.ReactElement {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div>
      <InputField
        value={searchValue}
        onChange={({ value }: any) => {
          setSearchValue(value);
        }}
        placeholder={i18n.t("Search by name, code or id")}
      />
    </div>
  );
}
