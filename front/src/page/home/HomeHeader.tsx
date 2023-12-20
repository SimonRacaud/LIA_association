import { IconButton, Stack, Typography } from "@mui/material";
import User, { UserType } from "classes/User";
import SettingsIcon from "@mui/icons-material/Settings";
import CreateIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { Item } from "components/EventTeamCardList";

export type HomeHeaderProps = {
  onClickSettings: () => void;
  onClickCreateEvent: () => void;
  onClickLogout: () => void;
  user?: User;
};

export default function HomeHeader({
  onClickSettings,
  onClickCreateEvent,
  onClickLogout,
  user,
}: HomeHeaderProps) {
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        my: 1,
      }}
    >
      {user?.role == UserType.ADMIN && (
        <IconButton
          aria-label="settings"
          size="large"
          onClick={onClickSettings}
        >
          <SettingsIcon />
        </IconButton>
      )}
      {user?.role == UserType.ADMIN && (
        <IconButton
          aria-label="create"
          size="large"
          onClick={onClickCreateEvent}
        >
          <CreateIcon />
        </IconButton>
      )}
      <IconButton aria-label="logout" size="large" onClick={onClickLogout}>
        <LogoutIcon />
      </IconButton>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mr: 1,
        }}
      >
        {user?.username}
      </Typography>
      {user?.role == UserType.ADMIN && (
        <Item sx={{ mx: 2 }}>Administrateur</Item>
      )}
    </Stack>
  );
}
