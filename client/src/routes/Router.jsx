import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import usersRoutes from './users'
import homeRoutes from './home'
import adminRoutes from './admin'
import adminEmpresaRoutes from './adminEmpresa'
import NotFound from '../pages/NotFoud'
import Login from '../pages/Auth/Login'
import ForgotPassword from '../pages/Auth/ForgotPassword'
import ResetPassword from '../pages/Auth/ResetPassword'

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
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
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