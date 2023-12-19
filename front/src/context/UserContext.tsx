import React, { createContext, useState } from 'react'
import User, { UserType } from 'classes/User'
import { AuthService } from 'services/authService'
import { AxiosError } from 'axios'
import LoginReponse from 'models/LoginResponse'

export type UserContextType = {
  user?: User
  token?: string // Auth token
  setUser: (user: User) => void
  setToken: (token: string) => void
  logoutUser: () => void
  loginUser: (username: string, password: string) => Promise<boolean>
  isLogged: () => Promise<boolean>
}

const UserContext = createContext({} as UserContextType)

type UserProviderProps = {
  children: React.ReactNode
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string>()

  const setUserCtx = (user: User) => {
    setUser(user)
  }
  const setTokenCtx = (token: string) => {
    setToken(token)
  }
  const isLogged = async () => {
    if (!token || !user)
      return false
    return (await AuthService.getAuthentifiedUser(token)) != null
  }

  /**
   * User login
   * @param username 
   * @param password 
   * @returns Promise<User | null>
   */
  const loginUser = async (username: string, password: string): Promise<boolean> => {
    const response: LoginReponse = await AuthService.loginUser(username, password);

    setToken(response.token)
    console.info("Auth: token received");
    const user = await AuthService.getAuthentifiedUser(response.token);
    if (user) {
        console.info("Logged successfully:", user.username, user.email, user.role)
        user.role = UserType[user.role] as unknown as UserType
        setUser(user)
    }
    return user != null
  }

  /**
   * User logout
   */
  const logoutUser = () => {
    if (!token) {
      throw new AxiosError("Vous n'êtes pas connecté", "401");
    }

    AuthService.logoutUser(token).then(() => {
      setUser(undefined)
      setToken(undefined)
    }).catch((err: AxiosError) => {
        console.error("Network error: " + err.message)
        alert("Erreur: êtes-vous bien connecté à internet ?")
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        setUser: setUserCtx,
        setToken: setTokenCtx,
        logoutUser,
        loginUser,
        isLogged,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

const useUser = (): UserContextType => {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export { useUser }
export default UserProvider
