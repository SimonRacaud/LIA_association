import Event, { EventDto } from "classes/Event";
import Paginated from "models/Paginated";
import dayjs from "dayjs";
import { NetworkService } from "./NetworkService";
import Team from "classes/Team";
import TeamService from "./TeamService";
import Place, { PlaceDto } from "classes/Place";

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

  public async getList(page = 1, size = 10): Promise<Paginated<Event>> {
    const result: Paginated<EventDto> = await this.core.getList(page, size);

    return {
      data: result.data.map((d) => {
        return new Event(
          d.uuid,
          d.title,
          dayjs(d.date, "DD-MM-YYYY"),
          d.teams,
          new Place(
            d.place!!.uuid,
            d.place!!.label,
            d.place!!.created_at,
            d.place!!.updated_at
          )
        );
      }),
      max: result.max,
      page: result.page,
    };
  }

  public async update(data: Event): Promise<void> {
    const event = await this.core.update({
      uuid: data.uuid,
      title: data.title,
      date: data.date.format("DD/MM/YYYY"),
      place_uuid: data.place?.uuid,
    });
    // Create teams:
    await Promise.all(
      data.teams.map(async (team) => {
        // Check if the team has to be added to the event
        const search = event.teams?.find((t: Team) => t.uuid === team.uuid);

        if (!search) {
          await TeamService.create({
            event_uuid: event.uuid,
            template_uuid: team.template.uuid,
          });
        }
      })
    );

    // Remove teams:
    if (event.teams) {
      await Promise.all(
        event.teams?.map(async (team) => {
          // Check if the team is no longer in the event
          const search = data.teams.find((t: Team) => t.uuid === team.uuid);

          if (!search) {
            await TeamService.remove(team.uuid);
          }
        })
      );
    }
  }

  public async create(data: Event): Promise<void> {
    const event = await this.core.create({
      uuid: "",
      title: data.title,
      date: data.date.format("DD/MM/YYYY"),
      place_uuid: data.place?.uuid,
    });

    // create teams
    await Promise.all(
      data.teams.map(async (team) => {
        await TeamService.create({
          event_uuid: event.uuid,
          template_uuid: team.template.uuid,
        });
      })
    );
  }
  public async getOne(id: string): Promise<Event | null> {
    const result = await this.core.getOne(id);
    if (result) {
      return new Event(
        result.uuid,
        result.title,
        dayjs(result.date, "DD-MM-YYYY"),
        result.teams,
        new Place(
          result.place!!.uuid,
          result.place!!.label,
          result.place!!.created_at,
          result.place!!.updated_at
        )
      );
    }
    return null;
  }
  public async remove(id: string): Promise<void> {
    await this.core.remove(id);
  }
}
