import i18n from "@dhis2/d2-i18n";
import React from "react";
import { InputField } from "@dhis2/ui";
import { debounce } from "lodash";

const { useState } = React;

type Props = {
  onSearch: (newPage: string) => void;
};

export default function IndicatorSearch({
  onSearch,
}: Props): React.ReactElement {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div style={{ width: "30vw" }}>
      <InputField
        value={searchValue}
        onChange={({ value }: any) => {
          setSearchValue(value);
          debounce((value) => onSearch(value), 3000)(value);
        }}
        placeholder={i18n.t("Search by name, code or id")}
      />
    </div>
  );
}
