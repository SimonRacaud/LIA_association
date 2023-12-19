import { UserType } from 'classes/User'
import { useUser } from 'context/UserContext'
import { useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom'

type ProtectedRouteProps = {
  children: JSX.Element,
  role?: UserType
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isLogged, user } = useUser()
  const [isUserLogged, setIsUserLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    const isAuth: boolean = await isLogged()
    setIsUserLogged(isAuth)
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if ((!isUserLogged && !isLoading) 
    || (role == UserType.ADMIN && user?.role != UserType.ADMIN)) {
    return <Navigate to="/login" replace />
  }

  return children
}
