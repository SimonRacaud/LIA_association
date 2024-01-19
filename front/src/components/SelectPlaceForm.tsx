import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { AxiosError } from "axios";
import Place from "classes/Place";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";
import Paginated, { PaginationQuery } from "models/Paginated";
import { useEffect, useState } from "react";
import PlaceService from "services/PlaceService";

type SelectPlaceFormProps = {
  place?: Place;
  setPlace: (p: Place) => void;
  setErrorNet: (e: NetErrorBody) => void;
  disable?: boolean;
};

export default function SelectPlaceForm({
  place,
  setPlace,
  setErrorNet,
  disable
}: SelectPlaceFormProps) {
  const [list, setList] = useState<Paginated<Place>>();
  const [listQuery, setListQuery] = useState<PaginationQuery>({
    page: 1,
    size: 10,
  });
  const network = PlaceService.getInstance();

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setList(await network.getList(listQuery.page, listQuery.size));
    } catch (error) {
      const netError = error as AxiosError;
      const errorBody = netError.response?.data as NetErrorBody;
      console.error((error as AxiosError).message);
      if (errorBody != undefined) {
        setErrorNet(errorBody);
      } else {
        setErrorNet(NetFailureBody);
      }
    }
  };
  const handleChangePlace = (e: SelectChangeEvent) => {
    const value = e.target.value;

    const newPlace = list?.data.find((p) => p.uuid === value);
    if (newPlace) {
      setPlace(newPlace);
    }
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
      <InputLabel id="place-label">Lieu</InputLabel>
      <Select
        labelId="place-label"
        value={place?.uuid}
        onChange={handleChangePlace}
        disabled={disable}
      >
        {list?.data.map((p) => {
          return (
            <MenuItem key={p.uuid} value={p.uuid}>
              {p.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
