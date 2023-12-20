import dayjs, { Dayjs } from "dayjs";
import Team from "./Team"
import IDataModel from "models/IModel";

export interface EventDto extends IDataModel {
    title: string
    date: string
    teams?: Team[]
}

export default class Event implements IDataModel {
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