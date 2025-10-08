import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import usersRoutes from './users'
import Home from '../pages/Home'
import RoutesPage from '../pages/RoutesPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/rutas",
    element: <RoutesPage />
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
    element: <h2>Home</h2>
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}