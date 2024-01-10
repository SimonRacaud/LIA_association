import { Box, Tab, Tabs } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import { TeamType, teamTypeToString } from "classes/TeamTemplate";
import User from "classes/User";
import { CustomTabPanel, tabPanelA11yProps } from "components/CustomTabPanel";
import { ViewMode } from "page/home/EventShowDialog";
import { useEffect, useState } from "react";
import EventTeamCardList from "./EventTeamCardList";
import EventTeamTable from "./EventTeamTable";

export type EventShowTabsProps = {
  event: Event;
  user: User;
  viewMode: ViewMode;
  onSubscribeEventTeam: (t: Team) => void;
  onUnsubscribeEventTeam: (t: Team) => void;
};

export default function EventShowTabs({
  event,
  user,
  viewMode,
  onSubscribeEventTeam,
  onUnsubscribeEventTeam,
}: EventShowTabsProps) {
  const [eventTypes, setEventTypes] = useState<TeamType[]>();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setEventTypes(getTeamTypes(event.teams));
  }, []);

  const getTeamTypes = (teams: Team[]): TeamType[] => {
    return teams.reduce(
      (prev: TeamType[], current: Team, idx: number, array: Team[]) => {
        return prev.find((v: TeamType) => v == current.template.type) ==
          undefined
          ? [...prev, current.template.type]
          : prev;
      },
      [] as TeamType[]
    );
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  const getTeams = (teams: Team[], type: TeamType): Team[] => {
    return teams.filter((team) => team.template.type === type)
  }

  return (
    <span>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
        >
          {eventTypes?.map((type) => (
            <Tab label={teamTypeToString(type)} {...tabPanelA11yProps(0)} key={type} />
          ))}
        </Tabs>
      </Box>
      {eventTypes?.map((type, index) => (
        <CustomTabPanel value={tabIndex} index={index} key={index}>
            {viewMode == ViewMode.CARDS &&
                <EventTeamCardList teams={getTeams(event.teams, type)} user={user as User} 
                    onSubscribeTeam={onSubscribeEventTeam} 
                    onUnsubscribeTeam={onUnsubscribeEventTeam} />
                ||
                <EventTeamTable teams={getTeams(event.teams, type)} user={user as User} 
                    onSubscribeTeam={onSubscribeEventTeam} 
                    onUnsubscribeTeam={onUnsubscribeEventTeam} />
            }
        </CustomTabPanel>
      ))}
    </span>
  );
}
