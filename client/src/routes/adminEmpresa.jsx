import RequireAuth from '../components/RequireAuth'
import DashboardAdmin from '../pages/Admin-empresa/Dashboard'
import AdminLayout from '../components/AdminLayout'
import LineaRutas from '../pages/Admin-empresa/LineaRutas'
import LineaBuses from '../pages/Admin-empresa/LineaBuses'

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
        element : <LineaBuses/>
      }
    ],
  },
]

export default adminEmpresaRoutes
