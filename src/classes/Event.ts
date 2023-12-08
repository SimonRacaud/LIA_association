import Team from "./Team"

export default class Event {
    title: string
    date: Date
    teams: Team[]

    constructor(title: string, date: Date, teams: Team[] = []) {
        this.title = title
        this.date = date
        this.teams = teams
    }
}