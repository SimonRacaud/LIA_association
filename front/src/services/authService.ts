import { apiInstance } from './apiInstance'
import User from 'classes/User'
import { AxiosRequestConfig } from 'axios'

export class AuthService {
  public static async loginUser(
    username: string,
    password: string
  ): Promise<void> {
    const reqConfig: AxiosRequestConfig<{}> = {
      withCredentials: true,
    }

    await apiInstance.post(
      '/auth/login',
      {
        username,
        password,
      },
      reqConfig
    )
  }

  public static async logoutUser(): Promise<void> {
    const reqConfig: AxiosRequestConfig<{}> = {
      withCredentials: true,
    }

    await apiInstance.post('/auth/logout', {}, reqConfig)
  }

  public static async getAuthentifiedUser(): Promise<User | null> {
    const reqConfig: AxiosRequestConfig<{}> = {
      withCredentials: true,
    }

    try {
      const res = await apiInstance.get('/user/me', reqConfig)
      return res.data as User
    } catch (error) {
      console.error(error)
      return null
    }
  }

  public static async isUserLogged(): Promise<boolean> {
    const authentifiedUser = await this.getAuthentifiedUser()
    return authentifiedUser !== null
  }
}
