import {
  FormControl,
} from "@mui/material";
import { AxiosError } from "axios";
import Place from "classes/Place";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";
import Paginated, { TxtFilterPaginationQuery } from "models/Paginated";
import { useEffect, useState } from "react";
import PlaceService from "services/PlaceService";
import PaginatedSelect from "./PaginatedSelect";

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
  disable,
}: SelectPlaceFormProps) {
  const [list, setList] = useState<Paginated<Place>>();
  const [listQuery, setListQuery] = useState<TxtFilterPaginationQuery>({
    page: 1,
    size: 20,
  });
  const network = PlaceService.getInstance();

  useEffect(() => {
    fetchList();
  }, [listQuery]);

  const fetchList = async () => {
    try {
      const newList = await network.getList(
        listQuery.page,
        listQuery.size,
        listQuery.filter
      );
      if (list && newList.page > list.page) {
        setList({
          max: newList.max,
          page: newList.page,
          data: [...list.data, ...newList.data],
        });
      } else if (newList.page == 1) {
        setList(newList);
      }
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
  const filterChoices = (filter: string) => {
    if (filter === "") {
      setListQuery({
        ...listQuery,
        page: 1,
        filter: undefined,
      });
    } else {
      setListQuery({
        ...listQuery,
        page: 1,
        filter: filter,
      });
    }
  };
  const loadNextPage = () => {
    if (!list || listQuery.page < list?.max) {
      setListQuery({
        ...listQuery,
        page: listQuery.page + 1,
      });
    }
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
      <PaginatedSelect<Place, Place>
        choices={list?.data}
        select={place}
        setSelect={setPlace}
        getModelLabel={(v: Place) => v.label ?? ""}
        inputLabel="Lieu"
        reloadChoices={filterChoices}
        loadNextPage={loadNextPage}
        disabled={disable}
      />
    </FormControl>
  );
}
