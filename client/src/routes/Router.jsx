import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import usersRoutes from './users'
import homeRoutes from './home'

const router = createBrowserRouter([
  ...homeRoutes,
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
    element: <h2>Home</h2>
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}