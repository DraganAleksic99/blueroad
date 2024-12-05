import ReactDOM from 'react-dom/client'
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'

import Layout from './App'
import ProtectedRoute from './components/ProtectedRoute'
import Users, { usersLoader } from './routes/Users'
import Signin from './routes/Signin'
import Signup from './routes/Signup'
import Profile from './routes/Profile'
import EditProfile from './routes/EditProfile'
import NewsFeed from './routes/NewsFeed'
import PostFeed from './routes/PostFeed'
import Bookmarks from './components/Bookmarks'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="login" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
        path="/"
      >
        <Route
          index
          element={
            <ProtectedRoute>
              <NewsFeed />
            </ProtectedRoute>
          }
        />
        <Route path="users" loader={usersLoader(queryClient)} element={<Users />} />
        <Route
          path="user/edit/:userId"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
