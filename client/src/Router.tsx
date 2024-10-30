import { Route, Routes } from 'react-router'
import Users from './views/Users'
import Signin from './views/Signin'
import Signup from './views/Signup'
import Profile from './views/Profile'
import EditProfile from './views/EditProfile'
import NewsFeed from './views/post/NewsFeed'
import ProtectedRoute from './components/ProtectedRoute'

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<ProtectedRoute><NewsFeed /></ProtectedRoute>} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/user/edit/:userId" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/user/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default MainRouter
