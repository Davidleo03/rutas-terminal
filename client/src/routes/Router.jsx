import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import usersRoutes from './users'
import Home from '../pages/Home'

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home</div>
  },
  {
    path: "/about",
    element: <div>About</div>
  },
  {
    path: "/users",
    children: usersRoutes
  },
  {
    path: "/home",
    element: <Home />
  }
])

export default function Router () {
    return <RouterProvider router={router} />
}