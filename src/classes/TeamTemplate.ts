export enum TeamType {
    RAMASSAGE,
    DISTRIB
}

export const teamTypeToString = (teamType: TeamType): string => {
    return TeamType[teamType];
};

export default class TeamTemplate {
    title: string
    type: TeamType
    note: string
    maxMember: number

    constructor(title: string, type: TeamType, note: string, maxMember: number) {
        this.title = title
        this.type = type
        this.note = note
        this.maxMember = maxMember
    }
}