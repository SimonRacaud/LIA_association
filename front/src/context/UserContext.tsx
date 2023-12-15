import React, { createContext, useState } from 'react'
import User, { UserType } from 'classes/User'
import { AuthService } from 'services/authService'
import { AxiosError } from 'axios'

export type UserContextType = {
  user?: User
  isLogged: boolean
  setUser: (user: User) => void
  logoutUser: () => void
  verifyAuth: () => Promise<boolean>
  refreshUser: () => Promise<void>
}

const UserContext = createContext({} as UserContextType)

type UserProviderProps = {
  children: React.ReactNode
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>()
  const [isLogged, setIsLogged] = useState(false)

  const setUserCtx = (user: User) => {
    setUser(user)
    setIsLogged(true)
  }

  const logoutUser = () => {
    AuthService.logoutUser().then(() => {
      setUser(undefined)
      setIsLogged(false)
    }).catch((err: AxiosError) => {
        console.error("Network error: " + err.message)
        alert("Erreur: êtes-vous bien connecté à internet ?")
    })
  }

  const refreshUser = async () => {
    const user = await AuthService.getAuthentifiedUser()
    if (user) {
      setUser(user)
      setIsLogged(true)
    } else {
      setUser(undefined)
      setIsLogged(false)
    }
  }

  const verifyAuth = async (): Promise<boolean> => {
    setUser(new User("4242", "admin", UserType.ADMIN, new Date(), "admin@admin.fr"))
    setIsLogged(true)
    return true // TODO : debug

    if (isLogged) {
      return true
    }

    const user = await AuthService.getAuthentifiedUser()
    if (user != null) {
      setIsLogged(true)
      // setUser(user)
      return true
    }

    return false
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLogged,
        setUser: setUserCtx,
        logoutUser,
        verifyAuth,
        refreshUser,
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
