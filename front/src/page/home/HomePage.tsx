import { Container } from "@mui/material";
import Event from "classes/Event";
import EventShowDialog from "./EventShowDialog";
import EventEditDialog from "./EventEditDialog";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UserContext";
import AlertDialog from "components/AlertDialog";
import EventService from "services/EventService";
import Paginated, { PaginationQuery } from "models/Paginated";
import { AxiosError } from "axios";
import HomeHeader from "./HomeHeader";
import { useEffect, useState } from "react";
import EventTable from "./EventTable";
import ErrorNotification from "components/ErrorNotification";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";

export default function HomePage() {
  const [selectedEvent, setSelecteEvent] = useState<Event | undefined>();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [eventList, setEventList] = useState<Paginated<Event>>();
  const [ errorNet, setErrorNet ] = useState<NetErrorBody>()
  const [listQuery, setListQuery] = useState<PaginationQuery>({
    page: 1,
    size: 10,
  });
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();
  const networkEvent = EventService.getInstance();

  useEffect(() => {
    loadEventList();
  }, []);

  const loadEventList = async (page?: number, size?: number) => {
    try {
      // API call
      setEventList(
        await networkEvent.getList(
          page ?? listQuery.page,
          size ?? listQuery.size
        )
      );
    } catch (error) {
      const errorNetwork = error as AxiosError;
      const errorBody = errorNetwork.response?.data as NetErrorBody;
      console.error(errorNetwork.message);
      if (errorBody) {
        setErrorNet(NetFailureBody);
      } else {
        setErrorNet(errorBody);
      }
    }
  };
  const onCloseDialog = (refresh: boolean = false) => {
    setOpenShowDialog(false);
    setOpenEditDialog(false);
    setSelecteEvent(undefined);
    if (refresh) loadEventList();
  };
    const onApplyDeleteEvent = async () => {
        setOpenAlertDialog(false);
        if (selectedEvent) {
            try {
                // API call : remove event
                await networkEvent.remove(selectedEvent.uuid);
            } catch (error) {
                const errorNetwork = error as AxiosError;
                const errorBody = errorNetwork.response?.data as NetErrorBody;
                console.error(errorNetwork.message);
                if (errorBody) {
                    setErrorNet(NetFailureBody);
                } else {
                    setErrorNet(errorBody);
                }
            }
            // Refresh list
            loadEventList();
        }
    };
  const onCreateEvent = () => {
    setSelecteEvent(undefined);
    setOpenEditDialog(true);
  };
  const onOpenSettings = () => {
    navigate("/settings");
  };
  const onLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <Container>
      <HomeHeader
        onClickSettings={onOpenSettings}
        onClickCreateEvent={onCreateEvent}
        user={user}
        onClickLogout={onLogout}
      />
      <EventTable
        user={user}
        eventList={eventList}
        listQuery={listQuery}
        setSelecteEvent={setSelecteEvent}
        setOpenEditDialog={setOpenEditDialog}
        setListQuery={setListQuery}
        setOpenAlertDialog={setOpenAlertDialog}
        loadEventList={loadEventList}
        setOpenShowDialog={setOpenShowDialog}
      />
      <EventShowDialog
        open={openShowDialog}
        event={selectedEvent}
        onClose={onCloseDialog}
      ></EventShowDialog>
      <EventEditDialog
        open={openEditDialog}
        onClose={onCloseDialog}
        toEdit={selectedEvent}
      />
      <AlertDialog
        open={openAlertDialog}
        onClose={() => setOpenAlertDialog(false)}
        onAgree={onApplyDeleteEvent}
        question="Confirmer la suppression ?"
      />
      <ErrorNotification show={errorNet != undefined}
            onClose={() => setErrorNet(undefined)}
            netError={errorNet}
        />
    </Container>
  );
}
