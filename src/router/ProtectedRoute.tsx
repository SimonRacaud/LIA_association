import { useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom'
//import { useUser } from '@/context/UserContext'

type ProtectedRouteProps = {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  //const { verifyAuth } = useUser()
  const [isLogged, setIsLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    const isAuth = false // await verifyAuth()
    setIsLogged(isAuth)
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [isLoading])

  if (!isLogged && !isLoading) {
    return <Navigate to="/login" replace />
  }

  return children
}
