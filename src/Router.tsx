import { Route, Routes } from 'react-router'
import Users from './views/Users'
import Signin from './views/Signin'
import Signup from './views/Signup'
import Home from './Home'
import Profile from './views/Profile'
import EditProfile from './views/EditProfile'

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/user/edit/:userId" element={<EditProfile />} />
        <Route path="/user/:userId" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default MainRouter
