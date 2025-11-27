import RequireAuth from '../components/RequireAuth'
import Admin from '../pages/Admin/Admin'
import AdminLayout from '../components/AdminLayout'
import Rutas from '../pages/Admin/Rutas'
import Empresas from '../pages/Admin/Empresas'
import Usuarios from '../pages/Admin/Usuarios'
import Buses from '../pages/Admin/Buses'
import Choferes from '../pages/Admin/Choferes'
import RutasTiempoReal from '../pages/Admin/RutasTiempoReal'
import AsignacionChoferes from '../pages/Admin/AsignacionChoferes'
import ReportesViajes from '../pages/Admin/ReportesViajes'

const adminRoutes = [
  {
    path: '/admin',
    element: (
      <RequireAuth allowedRoles={[ 'admin' ]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Admin />,
      },
      {
        path: 'rutas',
        element: <Rutas />,
      },
      {
        path: 'empresas',
        element: <Empresas />,
      },
      {
        path: 'usuarios',
        element: <Usuarios />,
      },
      {
        path: 'buses',
        element: <Buses />,
      },
      {
        path: 'choferes',
        element: <Choferes />,
      },
      {
        path: 'rutas-tiempo-real',
        element: <RutasTiempoReal />,
      },
      {
        path: 'asignacion-choferes',
        element: <AsignacionChoferes />,
      },
      {
        path: 'reportes-viajes',
        element: <ReportesViajes />,
      },
    ],
  },
]

export default adminRoutes
