import { apiInstance } from './apiInstance'
import User, { UserType, userTypeToString } from 'classes/User'
import { AxiosError } from 'axios'
import LoginReponse from 'models/LoginResponse'
import Cookie from 'context/Cookie'

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
    const response = await apiInstance.post(
      '/login',
      {
        username,
        password,
      }
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
    await apiInstance.post(
      '/login',
      {
        username,
        password,
        email,
        role: userTypeToString(role)
      }
    )
  }
  /**
   * Invalidate current auth token
   */
  public static async logoutUser(): Promise<void> {
    await apiInstance.post('/logout', {})
    Cookie.removeAuthCookie()
  }
  /**
   * Fetch currently logged user's informations
   * @param token 
   * @returns 
   */
  public static async getAuthentifiedUser(): Promise<User | null> {
    try {
      const res = await apiInstance.get('/user/me')
      return res.data.data as User
    } catch (error) {
      console.error("Network error: " + (error as AxiosError).message)
      return null
    }
  }
}
