import {
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Event from "classes/Event";
import TeamTemplate from "classes/TeamTemplate";
import { useEffect, useReducer, useState } from "react";
import Team from "classes/Team";
import RemoveIcon from "@mui/icons-material/Delete";
import TeamForm from "../TeamForm";
import Paginated, { TxtFilterPaginationQuery } from "models/Paginated";
import TeamTemplateService from "services/TeamTemplateService";
import { AxiosError } from "axios";
import ErrorNotification from "../ErrorNotification";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";
import Place from "classes/Place";
import SelectPlaceForm from "components/SelectPlaceForm";
import PaginatedSelect from "components/PaginatedSelect";

type AddTeamFormProps = {
  event: Event;
  setEvent: (v: Event) => void;
  setErrorMsg: (m: string) => void;
  setErrorNet: (e: NetErrorBody) => void;
};

function AddTeamForm({ event, setEvent, setErrorMsg, setErrorNet }: AddTeamFormProps) {
  const [newTemplates, setNewTemplates] = useState<TeamTemplate[]>([]);
  const [list, setList] = useState<Paginated<TeamTemplate>>();
  const [listQuery, setListQuery] = useState<TxtFilterPaginationQuery>({
    page: 1,
    size: 20,
  });
  const network = TeamTemplateService.getInstance();

  useEffect(() => {
    fetchList();
  }, [listQuery]);

  const fetchList = async () => {
    try {
       const newList = await network.getList(
        listQuery.page,
        listQuery.size,
        event.place?.uuid,
        listQuery.filter,
      );
      if (list && newList.page > list.page) {
        // Adding next page
        setList({
          max: newList.max,
          page: newList.page,
          data: [...list.data, ...newList.data]
        })
      } else if (newList.page == 1) {
        setList(newList); // Reload page
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
  const handleAddNewTeamTemplate = () => {
    if (list && newTemplates.length > 0) {
      // Filter templates already in the event:
      const toAdd = newTemplates.filter((t: TeamTemplate) => {
        return (event.teams.find((v) => t.uuid == v.template.uuid) == undefined);
      });
      // Add new templates to event:
      setEvent({
        ...event,
        teams: [
          ...event.teams,
          ...toAdd.map(
            (template: TeamTemplate) => new Team("", template)
          ),
        ],
      });
      setNewTemplates([]); // Empty selection
      if (toAdd.length == 0) {
        setErrorMsg("L'équipe existe déjà dans l'évènement");
      }
    }
  };
  const handleSelectAll = () => {
    if (list) {
      if (list.data.length == newTemplates.length) { // Is full
        setNewTemplates([]); // Clear all
      } else {
        setNewTemplates(list.data); // Select all
      }
    }
  };
  const filterChoices = (filter: string) => {
    if (filter === "") {
      setListQuery({
        ...listQuery,
        page: 1,
        filter: undefined
      });
    } else {
      setListQuery({
        ...listQuery,
        page: 1,
        filter: filter
      });
    }
  }
  const loadNextPage = () => {
      if (!list || listQuery.page < list?.max) {
        setListQuery({
          ...listQuery,
          page: listQuery.page + 1
        })
      }
  }

  return (
    <Stack spacing={2}>
      {(list?.data.length == newTemplates.length && (
        <Button onClick={handleSelectAll} variant="outlined">
          Vider
        </Button>
      )) || (
        <Button onClick={handleSelectAll} variant="outlined">
          Tout séléctionner
        </Button>
      )}
      <PaginatedSelect
        choices={list?.data}
        select={newTemplates}
        getModelLabel={(v: TeamTemplate) => v.title}
        inputLabel="Ajouter des équipes:"
        setSelect={setNewTemplates}
        multiple={true}
        reloadChoices={filterChoices}
        loadNextPage={loadNextPage}
      />
      <Button onClick={handleAddNewTeamTemplate} variant="contained">
        Ajouter
      </Button>
    </Stack>
  );
}

type EventFormProps = {
  initEvent?: Event;
  onSubmit: (e: Event) => void;
};

export default function EventForm({ initEvent, onSubmit }: EventFormProps) {
  const [event, setEvent] = useState(initEvent ?? new Event());
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [errorNet, setErrorNet] = useState<NetErrorBody>();
  
  const onSubmitForm = () => {
    onSubmit(event);
  };
  const handleCloseError = () => {
    setErrorMsg(undefined);
    setErrorNet(undefined);
  };
  const removeTeamTemplate = (uuid: string) => () => {
    event.teams = event.teams.filter((v) => v.template.uuid != uuid);
    setEvent(event);
    forceUpdate();
  };
  const updateTeam = (index: number) => (team: Team, update: boolean) => {
    if (index >= 0 && index < event.teams.length) event.teams[index] = team;
    setEvent(event);
    if (update) forceUpdate();
  };

  return (
    <Stack
      sx={{
        m: 2,
        minHeight: 200,
      }}
      spacing={2}
    >
      <TextField
        id="title"
        label="Titre"
        variant="standard"
        defaultValue={event.title}
        onChange={(e) => {
          event.title = e.target.value;
        }}
      />
      <DatePicker
        value={event.date}
        disablePast={initEvent == undefined}
        format="DD/MM/YYYY"
        onChange={(e) => {
          if (e) event.date = e;
        }}
      />
      <SelectPlaceForm
        place={event.place}
        setErrorNet={setErrorNet}
        setPlace={(p: Place) => {
          setEvent({
            ...event,
            place: p,
          });
          forceUpdate();
        }}
      />

      <Divider />

      {event.teams.length == 0 && (
        <Typography variant="subtitle2">
          Aucune équipe dans l'événement
        </Typography>
      )}
      {event.teams.map((team, index) => {
        return (
          <Card key={team.template.title} sx={{ p: 2, m: 1 }}>
            <Container sx={{ display: "flex", justifyContent: "center" }}>
              <IconButton
                aria-label="remove"
                size="small"
                onClick={removeTeamTemplate(team.template.uuid)}
              >
                <RemoveIcon />
              </IconButton>
            </Container>
            <TeamForm team={team} setTeam={updateTeam(index)} />
          </Card>
        );
      })}
      <Divider />
      <AddTeamForm
        event={event}
        setEvent={setEvent}
        setErrorMsg={setErrorMsg}
        setErrorNet={setErrorNet}
      />
      <Divider />
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: 150,
          }}
          onClick={onSubmitForm}
        >
          Enregistrer
        </Button>
      </Container>
      {/* Error notification: */}
      <ErrorNotification
        show={errorMsg != undefined || errorNet != undefined}
        onClose={handleCloseError}
        message={errorMsg}
        netError={errorNet}
      />
    </Stack>
  );
}
