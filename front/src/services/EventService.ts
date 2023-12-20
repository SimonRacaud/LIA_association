import Event, { EventDto } from "classes/Event";
import Paginated from "models/Paginated";
import dayjs from "dayjs";
import { NetworkService } from "./NetworkService";

export default class EventService extends NetworkService<Event, EventDto> {
  constructor() {
    super("/event");
  }

  private static instance?: EventService;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EventService();
    }
    return this.instance;
  }

  public async getList(page = 0, size = 10): Promise<Paginated<Event>> {
    const result: Paginated<EventDto> = await this.core.getList(page, size);

    return {
      data: result.data.map((d) => {
        return new Event(
          d.uuid,
          d.title,
          dayjs(d.date, 'DD-MM-YYYY'),
          d.teams
        );
      }),
      max: result.max,
      page: result.page,
    };
  }

  public async update(data: Event): Promise<void> {
    await this.core.update({
      ...data,
      date: data.date.format("DD/MM/YYYY"),
    });
  }

  public async create(data: Event): Promise<void> {
    await this.core.create({
        ...data,
        date: data.date.format("DD/MM/YYYY")
    });
  }
  public async getOne(id: string): Promise<Event | null> {
    const result = await this.core.getOne(id);
    if (result) {
        return new Event(
            result.uuid,
            result.title,
            dayjs(result.date, 'DD-MM-YYYY'),
            result.teams
        )
    }
    return null
  }
  public async remove(id: string): Promise<void> {
    await this.core.remove(id)
  }
}
