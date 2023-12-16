import dayjs, { Dayjs } from "dayjs";
import Team from "./Team"

export default class Event {
    uuid: string
    title: string
    date: Dayjs;
    teams: Team[]

    constructor(
        uuid: string = "", 
        title: string = "", 
        date: Dayjs = dayjs(), 
        teams: Team[] = []
    ) {
        this.uuid = uuid
        this.title = title
        this.date = date
        this.teams = teams
    }
}