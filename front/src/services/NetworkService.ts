import { apiInstance } from "./apiInstance";
import Paginated from "models/Paginated";
import IDataModel from "models/IModel";

export abstract class NetworkService<
  T extends IDataModel,
  DTO extends IDataModel
> {
  protected core: NetworkCoreService<DTO>;

  constructor(endpoint: string) {
    this.core = new NetworkCoreService<DTO>(endpoint);
  }

  public abstract create(data: T): Promise<void>;
  public abstract getList(page: number, size: number): Promise<Paginated<T>>;
  public abstract getOne(id: string): Promise<T | null>;
  public abstract update(data: T): Promise<void>;
  public abstract remove(id: string): Promise<void>;
}

export default class NetworkCoreService<T extends IDataModel> {
  private endpoint: string;

  constructor(route: string) {
    this.endpoint = route;
  }

  public async create(data: T): Promise<T> {
    const response = await apiInstance.post(this.endpoint, data);
    return response.data;
  }

  public async getList(page = 0, size = 10, other: any = {}): Promise<Paginated<T>> {
    const params: {
      size: number;
      page: number;
    } = {
      size,
      page,
      ...other
    };

    const res = await apiInstance.get(this.endpoint, params);
    return res.data;
  }

  public async getOne(id: string): Promise<T | null> {
    try {
      const res = await apiInstance.get(`${this.endpoint}/${id}`);
      return res.data as T;
    } catch (error: any) {
      console.error(error?.message);
      return null;
    }
  }

  public async update(data: T): Promise<T> {
    const response = await apiInstance.put(`${this.endpoint}/${data.uuid}`, data);
    return response.data;
  }

  public async remove(id: string): Promise<void> {
    await apiInstance.delete(`${this.endpoint}/${id}`);
  }
}
