import { TeamDto } from "classes/Team";
import { apiInstance } from "./apiInstance";

export default class TeamService {
    private static endpoint: string = "/team";

    public static async create(data: TeamDto): Promise<void>
    {
        await apiInstance.post(TeamService.endpoint, data)
    }

    public static async update(uuid: string, data: TeamDto): Promise<void>
    {
        await apiInstance.put(`${TeamService.endpoint}/${uuid}`, data)
    }

    /** 
     * Can be accessed without admin privileges
     */
    public static async updateMembers(uuid: string, data: TeamDto): Promise<void>
    {
        await apiInstance.put(`${TeamService.endpoint}/subscribe/${uuid}`, data)
    }

    public static async remove(uuid: string): Promise<void>
    {
        await apiInstance.delete(`${TeamService.endpoint}/${uuid}`)   
    }

    //

    public static async memberSubscribe(teamUuid: string, userId: string): Promise<void>
    {
        await TeamService.updateMembers(teamUuid, {
            members_add: [userId]
        })
    }

    public static async memberUnsubscribe(teamUuid: string, userId: string): Promise<void>
    {
        await TeamService.updateMembers(teamUuid, {
            members_rm: [userId]
        })
    }
}