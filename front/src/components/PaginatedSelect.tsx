import { Autocomplete, FormControl, TextField } from "@mui/material";
import { useState } from "react";

type PaginatedSelectProps<M, S extends M[] | M> = {
  choices?: M[];
  inputLabel: string;
  select?: S;
  multiple?: boolean;
  disabled?: boolean
  getModelLabel: (v: M) => string;
  setSelect: (v: S) => void;
  reloadChoices: (filter: string) => void;
  loadNextPage: () => void;
};

export default function PaginatedSelect<M, S extends M[] | M>(
  props: PaginatedSelectProps<M, S>
) {
  const {
    choices,
    inputLabel,
    select,
    multiple,
    disabled,
    setSelect,
    getModelLabel,
    reloadChoices,
    loadNextPage,
  } = props;
  const [ lastInputChange, setLastInputChange ] = useState<number>()
  const REFRESH_RATE_LIMIT = 400; // ms

  const handleChangeMultiple = (selected: S | null) => {
    if (selected) {
      setSelect(selected);
    }
  };
  const handleInputChange = (str: string) => {
    const now = Date.now();
    // Limit refresh rate to avoid sending too many network requests
    if (!lastInputChange || now - lastInputChange > REFRESH_RATE_LIMIT) {
        setLastInputChange(now);
        reloadChoices(str);
    }
  };

  return (
    <FormControl variant="outlined">
      {choices && (
        <Autocomplete
            multiple={multiple}
            options={choices}
            value={select ?? null}
            getOptionLabel={getModelLabel}
            onChange={(_, v: any) => handleChangeMultiple(v)}
            disabled={disabled}
            onInputChange={(e, newInputValue) => handleInputChange(newInputValue)}
            renderInput={(params) => (
                <TextField {...params} variant="standard" label={inputLabel} />
            )}
            // Infinite scroll:
            ListboxProps={{
                sx: {
                    maxHeight: 400
                },
                onScroll: (event: React.SyntheticEvent) => {
                const listboxNode = event.currentTarget;
                if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
                    loadNextPage()
                }
                }
            }}
        />
      ) || <p>Erreur réseau</p>}
    </FormControl>
  );
}
