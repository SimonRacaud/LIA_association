import React, { createContext, useState } from 'react'
import User, { UserType } from 'classes/User'
import { AuthService } from 'services/AuthService'
import { AxiosError } from 'axios'
import LoginReponse from 'models/LoginResponse'

export type UserContextType = {
  user?: User
  setUser: (user: User) => void
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

  const setUserCtx = (user: User) => {
    user.role = UserType[user.role] as unknown as UserType
    setUser(user)
  }
  const isLogged = async () => {
    const user = await AuthService.getAuthentifiedUser();
    if (user) {
      setUserCtx(user)
    }
    return user != null
  }

  /**
   * User login
   * @param username 
   * @param password 
   * @returns Promise<User | null>
   */
  const loginUser = async (username: string, password: string): Promise<boolean> => {
    const response: LoginReponse = await AuthService.loginUser(username, password);

    return true
  }

  /**
   * User logout
   */
  const logoutUser = () => {
    AuthService.logoutUser().then(() => {
      setUser(undefined)
    }).catch((err: AxiosError) => {
        console.error("Network error: " + err.message)
        alert("Erreur: êtes-vous bien connecté à internet ?")
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: setUserCtx,
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
