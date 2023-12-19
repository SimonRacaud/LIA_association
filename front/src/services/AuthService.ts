import { apiInstance } from './apiInstance'
import User, { UserType, userTypeToString } from 'classes/User'
import { AxiosError, AxiosRequestConfig } from 'axios'
import LoginReponse from 'models/LoginResponse'

export class AuthService {
  /**
   * Login request
   * @param username 
   * @param password 
   * @returns 
   */
  public static async loginUser(
    username: string,
    password: string
  ): Promise<LoginReponse> {
    const reqConfig: AxiosRequestConfig<{}> = {
      headers : {
        "Content-Type" : "application/json"
      },
      withCredentials: true,
    }

    const response = await apiInstance.post(
      '/login',
      {
        username,
        password,
      },
      reqConfig
    )
    return new LoginReponse(response.data)
  }
  /**
   * Create new user account
   * @param username 
   * @param password 
   * @param role 
   * @param email 
   */
  public static async registerUser(
    username: string,
    password: string,
    role: UserType,
    email: string
  ): Promise<void> {
    const reqConfig: AxiosRequestConfig<{}> = {
      headers : {
        "Content-Type" : "application/json"
      },
      withCredentials: true,
    }

    await apiInstance.post(
      '/login',
      {
        username,
        password,
        email,
        role: userTypeToString(role)
      },
      reqConfig
    )
  }
  /**
   * Invalidate current auth token
   */
  public static async logoutUser(): Promise<void> {
    const reqConfig: AxiosRequestConfig<{}> = {
      withCredentials: true,
    }

    await apiInstance.post('/logout', {}, reqConfig)
  }
  /**
   * Fetch currently logged user's informations
   * @param token 
   * @returns 
   */
  public static async getAuthentifiedUser(): Promise<User | null> {
    const reqConfig: AxiosRequestConfig<{}> = {
      headers : {
        "Content-Type" : "application/json"
      },
      withCredentials: true,
    }

    try {
      const res = await apiInstance.get('/user/me', reqConfig)
      return res.data.data as User
    } catch (error) {
      console.error("Network error: " + (error as AxiosError).message)
      return null
    }
  }
}
