import RequireAuth from '../components/RequireAuth'
import DashboardAdmin from '../pages/Admin-empresa/Dashboard'
import AdminLayout from '../components/AdminLayout'

const adminEmpresaRoutes = [
  {
    path: "/admin-linea",
    element: (
      <RequireAuth allowedRoles={[ 'admin-linea' ]}>
        <AdminLayout/>
        
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <DashboardAdmin/>,
      },
      {
        path: "rutas",
        element : <><h2>Rutas</h2></>
      },
      {
        path: "buses",
        element : <><h2>Buses</h2></>
      }
    ],
  },
]

export default adminEmpresaRoutes
