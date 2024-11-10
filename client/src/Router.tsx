import { Route, createRoutesFromElements, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Users from './routes/Users'
import Signin from './views/Signin'
import Signup from './views/Signup'
import Profile from './views/Profile'
import EditProfile from './views/EditProfile'
import NewsFeed from './views/post/NewsFeed'
import PostFeed from './views/post/PostFeed'
import ProtectedRoute from './components/ProtectedRoute'
import { usersLoader } from './routes/Users'
import Layout from './App'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
      }
    >
      <Route path="/">
        <Route
          index
          element={
            <ProtectedRoute>
              <NewsFeed />
            </ProtectedRoute>
          }
        />
        <Route path="users" loader={usersLoader(queryClient)} element={<Users />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Signin />} />
        <Route
          path="user/edit/:userId"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/:userId/post/:postId"
          element={
            <ProtectedRoute>
              <PostFeed />
            </ProtectedRoute>
          }
        />
      </Route>
    </Route>
  )
)

export default router
