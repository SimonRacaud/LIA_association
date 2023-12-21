import {
  Box,
  Button,
  Container,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Event from "classes/Event";
import User, { UserType } from "classes/User";
import ShowDate from "components/ShowDate";
import Paginated, { PaginationQuery } from "models/Paginated";
import LaunchIcon from "@mui/icons-material/Launch";
import GroupIcon from "@mui/icons-material/Group";

export type EventTableProps = {
  user?: User;
  eventList?: Paginated<Event>;
  listQuery: PaginationQuery;
  setSelecteEvent: (e: Event | undefined) => void;
  setOpenEditDialog: (v: boolean) => void;
  setListQuery: (q: PaginationQuery) => void;
  setOpenAlertDialog: (v: boolean) => void;
  loadEventList: (page?: number, size?: number) => Promise<void>;
  setOpenShowDialog: (v: boolean) => void;
};

export default function EventTable({
  user,
  eventList,
  listQuery,
  setSelecteEvent,
  setOpenEditDialog,
  setListQuery,
  setOpenAlertDialog,
  loadEventList,
  setOpenShowDialog,
}: EventTableProps) {
  const onEditEvent = (event: Event) => () => {
    setSelecteEvent(event);
    setOpenEditDialog(true);
  };
  const onDeleteEvent = (uuid: string) => () => {
    setSelecteEvent(_getEventFromUuid(uuid));
    setOpenAlertDialog(true);
  };
  const onChangePage = (e: any, page: number) => {
    setListQuery({
      ...listQuery,
      page: page,
    });
    loadEventList(page); // Send API request
  };
  const _getEventFromUuid = (uuid: string) => {
    return eventList?.data.find((e: Event) => e.uuid == uuid);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Manque</TableCell>
            <TableCell>Montrer</TableCell>
            <TableCell>Événement</TableCell>
            {user?.role == UserType.ADMIN && (
              <TableCell align="right">Éditer</TableCell>
            )}
            {user?.role == UserType.ADMIN && (
              <TableCell align="right">Supprimer</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {eventList?.data.map((event: Event) => (
            <TableRow
              key={event.uuid}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <ShowDate dateDayjs={event.date} />
              </TableCell>
              <TableCell align="right">
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 0
                  }}
                >
                  <Typography sx={{ mr: 1 }}>
                    {event.getTeamsFreePlaces()}
                  </Typography>
                  <GroupIcon />
                </Container>
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="show-event"
                  size="large"
                  onClick={() => {
                    setSelecteEvent(event);
                    setOpenShowDialog(true);
                  }}
                >
                  <LaunchIcon />
                </IconButton>
              </TableCell>
              <TableCell>{event.title}</TableCell>
              {user?.role == UserType.ADMIN && (
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={onEditEvent(event)}
                    disabled={user?.role != UserType.ADMIN}
                  >
                    Éditer
                  </Button>
                </TableCell>
              )}
              {user?.role == UserType.ADMIN && (
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={onDeleteEvent(event.uuid)}
                    disabled={user?.role != UserType.ADMIN}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box
        display="flex"
        justifyContent="center">
        <Pagination
          count={eventList?.max}
          color="primary"
          sx={{ my: 2 }}
          onChange={onChangePage}
        />
      </Box>
    </TableContainer>
  );
}
