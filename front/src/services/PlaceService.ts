import Place, { PlaceDto } from "classes/Place";
import { NetworkService } from "./NetworkService";
import Paginated from "models/Paginated";

export default class PlaceService extends NetworkService<Place, PlaceDto> {
  constructor() {
    super("/place");
  }

  private static instance?: PlaceService;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PlaceService();
    }
    return this.instance;
  }

  public async getList(page = 1, size = 10, filter?: string): Promise<Paginated<Place>> {
    const result: Paginated<PlaceDto> = await this.core.getList(page, size, {
      label: filter
    });

    return {
      data: result.data.map((d: PlaceDto) => {
        return new Place(
          d.uuid, 
          d.label, 
          new Date(d.created_at as string),
          new Date(d.updated_at as string));
      }),
      max: result.max,
      page: result.page,
    };
  }

  public async update(data: Place): Promise<void> {
    await this.core.update({
      ...data,
      label: data.label,
    });
  }

  public async create(data: Place): Promise<void> {
    await this.core.create({
      ...data,
      label: data.label
    });
  }

  public async getOne(id: string): Promise<Place | null> {
    const result = await this.core.getOne(id);
    if (result) {
        return new Place(
            result.uuid,
            result.label
        )
    }
    return null
  }

  public async remove(id: string): Promise<void> {
    await this.core.remove(id)
  }
}