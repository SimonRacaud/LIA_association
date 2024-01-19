import { AxiosRequestConfig } from "axios";
import { apiInstance } from "./apiInstance";
import User from "classes/User";
import Paginated from "models/Paginated";

export default class UserService {

  public static createUser = async (user: User): Promise<void> => {
    await apiInstance.post("/register", user);
  };

  public static getUsers = async (
    page = 0,
    size = 10
  ): Promise<Paginated<User>> => {
    const params: {
      size: number;
      page: number;
    } = {
      size,
      page,
    };

    const res = await apiInstance.get("/users/", params);
    return res.data;
  };

  public static getUserInfo = async (id: string): Promise<User | null> => {
    try {
      const res = await apiInstance.get(`/users/${id}`);
      return res.data as User;
    } catch (error: any) {
      console.error(error?.message);
      return null;
    }
  };

  public static updateUser = async (user: User): Promise<void> => {
    await apiInstance.put(`/users/${user.id}`, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: (user.password == "") ? undefined : user.password,
      place_uuid: user.place?.uuid,
    });
  };

  public static updatePassword = async (
    userId: string,
    password: string
  ): Promise<void> => {
    await apiInstance.put(`/users/${userId}`, { password });
  };

  public static removeUser = async (id: string): Promise<void> => {
    await apiInstance.delete(`/users/${id}`);
  };
}
