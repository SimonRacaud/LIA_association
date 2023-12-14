import { UserType } from 'classes/User'
import { useUser } from 'context/UserContext'
import { useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom'

type ProtectedRouteProps = {
  children: JSX.Element,
  role?: UserType
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { verifyAuth, user } = useUser()
  const [isLogged, setIsLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    const isAuth = await verifyAuth()
    setIsLogged(isAuth)
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [isLoading])

  if ((!isLogged && !isLoading) 
    || (role == UserType.ADMIN && user?.role != UserType.ADMIN)) {
    return <Navigate to="/login" replace />
  }

  return children
}
