import RequireAuth from '../components/RequireAuth'
import Admin from '../pages/Admin/Admin'
import AdminLayout from '../components/AdminLayout'
import Rutas from '../pages/Admin/Rutas'
import Empresas from '../pages/Admin/Empresas'
import Usuarios from '../pages/Admin/Usuarios'
import Buses from '../pages/Admin/Buses'

import RutasTiempoReal from '../pages/Admin/RutasTiempoReal'
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
        path: 'rutas-tiempo-real',
        element: <RutasTiempoReal />,
      },
      
      {
        path: 'reportes-viajes',
        element: <ReportesViajes />,
      },
    ],
  },
]

export default adminRoutes
