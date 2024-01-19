import dayjs, { Dayjs } from "dayjs";
import Team from "./Team"
import IDataModel from "models/IModel";
import Place from "./Place";

export interface EventDto extends IDataModel {
    title: string
    date: string
    teams?: Team[]
    place?: Place
    place_uuid?: string
}

export function getTeamsFreePlaces(teams: Team[]): number
{
    return teams.reduce((prev, team, index, array) => {
        return prev + (team.template.maxMember - team.members.length)
    }, 0)
}

export default class Event implements IDataModel {
    uuid: string
    title: string
    date: Dayjs;
    teams: Team[]
    place?: Place

    constructor(
        uuid: string = "", 
        title: string = "", 
        date: Dayjs = dayjs(), 
        teams: Team[] = [],
        place?: Place
    ) {
        this.uuid = uuid
        this.title = title
        this.date = date
        this.teams = teams
        this.place = place
    }
}