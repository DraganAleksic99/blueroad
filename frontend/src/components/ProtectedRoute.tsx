import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import auth, { Session } from '../utils/utils'

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const session: Session = auth.isAuthenticated()

  return session ? children : <Navigate to="/login" />
}
