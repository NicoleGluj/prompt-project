import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  if (user) {
    return <Navigate to="/" />
  }

  return children
}