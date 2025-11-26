import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import usersRoutes from './users'
import homeRoutes from './home'
import NotFound from '../pages/NotFoud'
import Login from '../pages/Auth/Login'
import RequireAuth from '../components/RequireAuth'
import Admin from '../pages/Admin/Admin'
import AdminEmpresa from '../pages/Admin/AdminEmpresa'
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
      <RequireAuth allowedRoles={[ 'admin' ]}>
        <AdminLayout>
          <Admin />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/admin-empresa",
    element: (
      <RequireAuth allowedRoles={[ 'admin-linea' ]}>
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