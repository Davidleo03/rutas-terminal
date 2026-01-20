import RequireAuth from '../components/RequireAuth'
import DashboardAdmin from '../pages/Admin-empresa/Dashboard'
import AdminLayout from '../components/AdminLayout'
import LineaRutas from '../pages/Admin-empresa/LineaRutas'

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
        element : <LineaRutas/>
      },
      {
        path: "buses",
        element : <><h2>Buses</h2></>
      }
    ],
  },
]

export default adminEmpresaRoutes
