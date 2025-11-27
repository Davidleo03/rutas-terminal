import RequireAuth from '../components/RequireAuth'
import AdminEmpresa from '../pages/Admin/AdminEmpresa'
import AdminLayout from '../components/AdminLayout'

const adminEmpresaRoutes = [
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
]

export default adminEmpresaRoutes
