import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookie from 'context/Cookie'

const API_URL =
  process.env.REACT_APP_API_URL

const apiAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})


class API {

  public async post(path: string, body: any): Promise<AxiosResponse<any, any>> {
    return await apiAxios.post(path, body, this.getAuthHeader())
  }

  public async get(path: string, params: object = {}): Promise<AxiosResponse<any, any>> {
    return await apiAxios.get(path, {
      ...this.getAuthHeader(),
      params: params
    })
  }

  public async put(path: string, body: any): Promise<AxiosResponse<any, any>> {
    return await apiAxios.put(path, body, this.getAuthHeader())
  }

  public async delete(path: string): Promise<AxiosResponse<any, any>> {
    return await apiAxios.delete(path, this.getAuthHeader())
  }

  private getAuthHeader():  AxiosRequestConfig<{}>
  {
    const token = Cookie.getAuthToken()

    if (token == null) {
      return {
        headers: {
          "Content-Type": "application/json"
        }
      }
    }
    return {
      headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }
  }
}

export const apiInstance = new API()