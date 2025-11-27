import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import usersRoutes from './users'
import homeRoutes from './home'
import adminRoutes from './admin'
import adminEmpresaRoutes from './adminEmpresa'
import NotFound from '../pages/NotFoud'
import Login from '../pages/Auth/Login'

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
    path: "/login",
    element: <Login />
  },
  ...adminRoutes,
  ...adminEmpresaRoutes,
  {
    path: "*",
    element: <NotFound />
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}