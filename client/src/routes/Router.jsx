import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import usersRoutes from './users'
import homeRoutes from './home'
import NotFound from '../pages/NotFoud'
import Login from '../pages/Login'
import RequireAuth from '../components/RequireAuth'
import Admin from '../pages/Admin'
import AdminEmpresa from '../pages/AdminEmpresa'
import AdminLayout from '../components/AdminLayout'

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
    path: "/admin",
    element: (
      <RequireAuth>
        <AdminLayout>
          <Admin />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/admin-empresa",
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminEmpresa />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}