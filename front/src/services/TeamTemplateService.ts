import Paginated from "models/Paginated";
import { NetworkService } from "./NetworkService";
import TeamTemplate, { TeamTemplateDTO, TeamType } from "classes/TeamTemplate";

export default class TeamTemplateService extends NetworkService<TeamTemplate, TeamTemplateDTO> {
  constructor() {
    super("/team/template");
  }

  private static instance?: TeamTemplateService;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new TeamTemplateService();
    }
    return this.instance;
  }

  public async getList(page = 0, size = 10): Promise<Paginated<TeamTemplate>> {
    const result: Paginated<TeamTemplateDTO> = await this.core.getList(page, size);

    return {
      data: result.data.map((d: TeamTemplateDTO) => {
        return new TeamTemplate(
          d.uuid,
          d.title,
          d.type as TeamType,
          d.note,
          d.maxMember,
          new Date(d.created_at as string),
          new Date(d.updated_at as string),
        );
      }),
      max: result.max,
      page: result.page,
    };
  }

  public async update(data: TeamTemplate): Promise<void> {
    await this.core.update({
      ...data,
      type: data.type,
    });
  }

  public async create(data: TeamTemplate): Promise<void> {
    await this.core.create({
        ...data,
        type: data.type
    });
  }
  public async getOne(id: string): Promise<TeamTemplate | null> {
    const result = await this.core.getOne(id);
    if (result) {
        return new TeamTemplate(
            result.uuid,
            result.title,
            result.type as TeamType,
            result.note,
            result.maxMember
        )
    }
    return null
  }
  public async remove(id: string): Promise<void> {
    await this.core.remove(id)
  }
}
