import Paginated from "models/Paginated";
import { NetworkService } from "./NetworkService";
import TeamTemplate, { TeamTemplateDTO, TeamType } from "classes/TeamTemplate";
import Place from "classes/Place";

export default class TeamTemplateService extends NetworkService<
  TeamTemplate,
  TeamTemplateDTO
> {
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

  public async getList(page = 0, size = 10, placeId?: string, titleFilter?: string): Promise<Paginated<TeamTemplate>> {
    const result: Paginated<TeamTemplateDTO> = await this.core.getList(
      page,
      size,
      {
        placeId, 
        titleFilter
      }
    );

    return {
      data: result.data.map((d: TeamTemplateDTO) => {
        return new TeamTemplate(
          d.uuid,
          d.title,
          d.type as TeamType,
          d.note,
          d.maxMember,
          new Place(
            d.place!!.uuid,
            d.place!!.label,
            new Date(d.place!!.created_at as string),
            new Date(d.place!!.updated_at as string)
          ),
          new Date(d.created_at as string),
          new Date(d.updated_at as string)
        );
      }),
      max: result.max,
      page: result.page,
    };
  }

  public async update(data: TeamTemplate): Promise<void> {
    await this.core.update({
      ...data,
      place_uuid: data.place?.uuid
    });
  }

  public async create(data: TeamTemplate): Promise<void> {
    await this.core.create({
      ...data,
      place_uuid: data.place?.uuid
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
        result.maxMember,
        new Place(
          result.place!!.uuid,
          result.place!!.label,
          new Date(result.place!!.created_at as string),
          new Date(result.place!!.updated_at as string)
        ),
      );
    }
    return null;
  }
  public async remove(id: string): Promise<void> {
    await this.core.remove(id);
  }
}
