import { useState } from 'react';
import ModalNuevoUsuario from '../../components/ModalNuevoUsuario';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useUsuarios, useCreateUsuario, useDeleteUsuario } from '../../services/Usuarios/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';

const Usuarios = () => {

  const [openModal, setOpenModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [createError, setCreateError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [centerMessage, setCenterMessage] = useState(null);

  const addToast = (message, type = 'info', ttl = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  };

  // Usuarios: reemplazamos datos ejemplo por hook que trae usuarios reales
  const { data: usuariosData, isLoading: loadingUsuarios } = useUsuarios();
  const { mutate: crearUsuario, isLoading: creating } = useCreateUsuario();
  const { mutate: eliminarUsuario, isLoading: deleting } = useDeleteUsuario();

  const usuarios = Array.isArray(usuariosData) ? usuariosData : [];

  const handleEditar = (id_usuario) => {

    // Lógica para editar
  };

  const handleEliminar = (id_usuario) => {
    // Abrir dialogo de confirmación (manejado más abajo)
    setToDelete(id_usuario);
    setConfirmOpen(true);
  };

  const handleNuevoUsuario = () => {
    // Abrir modal para crear usuario
    setOpenModal(true);
  };

  const handleCreateUser = (payload) => {
    // Llamada a la mutation para crear usuario, la invalidación está gestionada en el hook
    // reseteamos errores previos
    setCreateError('');
    crearUsuario(
      { nuevoUsuario: payload },
      {
        onSuccess: () => {
          setOpenModal(false);
          addToast('Usuario creado correctamente', 'success');
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || err?.message || 'Error al crear usuario';
          setCreateError(msg);
          addToast(msg, 'error');
        },
      }
    );
  };

  const handleToggleActivo = (id_usuario, estadoActual) => {
    console.log('Cambiar estado de usuario:', id_usuario, 'Nuevo estado:', !estadoActual);
    // Lógica para cambiar estado activo/inactivo
  };

  const handleResetPassword = (id_usuario, email) => {
    console.log('Reset password para:', id_usuario, email);
    // Lógica para resetear contraseña
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    // mark which id is being deleted so UI can reflect state per-row
    setDeletingId(toDelete);
    eliminarUsuario(
      { id: toDelete },
      {
        onSuccess: () => {
          // show centered success message
          setCenterMessage('Usuario eliminado correctamente');
          setTimeout(() => setCenterMessage(null), 3000);
          addToast('Usuario eliminado', 'success');
          setConfirmOpen(false);
          setToDelete(null);
          setDeletingId(null);
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || err?.message || 'Error al eliminar usuario';
          addToast(msg, 'error');
          setDeletingId(null);
        },
      }
    );
  };

  // Función para formatear fecha
  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener nombre del rol
  const getNombreRol = (role) => {
    const roles = {
      'admin': 'Administrador',
      'admin-linea': 'Admin de Línea',
      'usuario': 'Usuario',
      'super-admin': 'Super Admin'
    };
    return roles[role] || role;
  };

  // Función para obtener color del rol
  const getColorRol = (role) => {
    const colores = {
      'admin': 'bg-purple-100 text-purple-800 border border-purple-200',
      'admin-linea': 'bg-blue-100 text-blue-800 border border-blue-200',
      'usuario': 'bg-green-100 text-green-800 border border-green-200',
      'super-admin': 'bg-red-100 text-red-800 border border-red-200'
    };
    return colores[role] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  // Función para obtener icono del rol
  const getIconoRol = (role) => {
    const iconos = {
      'admin': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'admin-linea': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      'usuario': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      'super-admin': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    };
    return iconos[role] || (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  // Estadísticas de usuarios
  const estadisticasUsuarios = {
    total: usuarios.length,
    activos: usuarios.filter(u => u.activo).length,
    inactivos: usuarios.filter(u => !u.activo).length,
    porRol: usuarios.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Administración de Usuarios</h1>
            <p className="mt-2 text-gray-600">Gestión completa de usuarios del sistema — Roles y permisos</p>
          </div>
          <button
            onClick={handleNuevoUsuario}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-md w-full sm:w-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Nuevo Usuario
          </button>
        </div>

        {/* Filtros rápidos */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
            Todos ({estadisticasUsuarios.total})
          </button>
          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
            Activos ({estadisticasUsuarios.activos})
          </button>
          <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors">
            Inactivos ({estadisticasUsuarios.inactivos})
          </button>
          {Object.entries(estadisticasUsuarios.porRol).map(([rol, cantidad]) => (
            <button
              key={rol}
              className="px-3 py-1 text-sm rounded-full hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: getColorRol(rol).split(' ')[0].replace('bg-', 'bg-').replace('100', '50'),
                color: getColorRol(rol).split(' ')[1].replace('text-', 'text-').replace('800', '700')
              }}
            >
              {getNombreRol(rol)} ({cantidad})
            </button>
          ))}
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loadingUsuarios ? (
            <LoadingSkeleton variant="table" />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Rol / Permisos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Detalles
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{usuario.email}</div>
                            <div className="text-xs text-gray-500">ID: {usuario.id_usuario}</div>
                          </div>
                        </div>

                        {/* Información para móviles */}
                        <div className="mt-3 space-y-2 md:hidden">
                          <div>
                            <div className="text-xs text-gray-500">Rol</div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorRol(usuario.role)}`}>
                                <span className="mr-1">{getIconoRol(usuario.role)}</span>
                                {getNombreRol(usuario.role)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-xs text-gray-500">Empresa ID</div>
                              <div className="text-sm font-medium text-gray-900">
                                {usuario.id_empresa || 'N/A'}
                              </div>
                            </div>
                            <div className="bg-green-200 rounded-2xl p-0.5 text-xs text-gray-500  text-center flex items-center">
                              <p className='ml-4'>{usuario?.empresa?.nombre_empresa}</p>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Auth ID</div>
                              <div className="text-xs font-mono text-gray-500 truncate" title={usuario.auth_id || 'N/A'}>
                                {usuario.auth_id ? usuario.auth_id.substring(0, 8) + '...' : 'N/A'}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Creación</div>
                            <div className="text-xs text-gray-500">{formatFecha(usuario.fecha_creacion)}</div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rol / Permisos - Desktop */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorRol(usuario.role)}`}>
                            <span className="mr-2">{getIconoRol(usuario.role)}</span>
                            {getNombreRol(usuario.role)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Empresa ID: {usuario.id_empresa || 'Ninguna'}
                          </div>
                          <div className="bg-green-200 rounded-2xl p-0.5 text-center flex items-center">
                            <p className='ml-4'>{usuario?.empresa?.nombre_empresa}</p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Detalles - Desktop */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      <div className="space-y-1">
                        <div>
                          <div className="text-xs text-gray-500">Auth ID</div>
                          <div className="text-xs font-mono text-gray-700 bg-gray-50 p-1 rounded truncate" title={usuario.auth_id || 'N/A'}>
                            {usuario.auth_id || 'No asignado'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Fecha de Creación</div>
                          <div className="text-sm text-gray-900">{formatFecha(usuario.fecha_creacion)}</div>
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start space-y-2">
                        <button
                          onClick={() => handleToggleActivo(usuario.id_usuario, usuario.activo)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${usuario.activo
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                        >
                          <svg className={`w-3 h-3 mr-1 ${usuario.activo ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            {usuario.activo ? (
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            ) : (
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            )}
                          </svg>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </button>


                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">

                          <button
                            onClick={() => handleEliminar(usuario.id_usuario)}
                            className={`text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50 flex items-center justify-center ${deletingId ? 'opacity-60 pointer-events-none' : ''}`}
                            title="Eliminar usuario"
                            disabled={!!deletingId}
                          >
                            {deletingId === usuario.id_usuario ? (
                              <span className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Eliminando...
                              </span>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer de la tabla */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700 mb-2 sm:mb-0">
              Mostrando <span className="font-medium">{usuarios.length}</span> usuarios
              <div className="text-xs text-gray-500 mt-1">
                {estadisticasUsuarios.activos} activos • {estadisticasUsuarios.inactivos} inactivos
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mensaje cuando no hay datos */}
      {usuarios.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-teal-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-10 w-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay usuarios registrados</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Comienza registrando el primer usuario del sistema. Puedes asignar diferentes roles y permisos según las necesidades.
          </p>
          <button
            onClick={handleNuevoUsuario}
            className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Registrar Primer Usuario
          </button>
        </div>
      )}

      {/* Modal para crear usuario */}
      <ModalNuevoUsuario open={openModal} onClose={() => setOpenModal(false)} onCreate={handleCreateUser} submitting={creating} serverError={createError} />

      {/* Confirm dialog para eliminar usuario */}
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar usuario"
        description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        onCancel={() => { setConfirmOpen(false); setToDelete(null); }}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      {/* Toasters locales */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm w-full px-4 py-3 rounded shadow ${t.type === 'success' ? 'bg-green-50 border border-green-100 text-green-800' : t.type === 'error' ? 'bg-rose-50 border border-rose-100 text-rose-800' : 'bg-gray-50 border border-gray-100 text-gray-800'}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Centered success message */}
      {centerMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-sm border border-green-100 text-green-800 px-6 py-4 rounded-lg shadow-lg">
            {centerMessage}
          </div>
        </div>
      )}

      {/* Información de roles */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Leyenda de Roles</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 mr-2">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span className="text-xs text-gray-600">Admin - Acceso total</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 mr-2">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <span className="text-xs text-gray-600">Admin Línea - Empresa específica</span>
          </div>

        </div>
      </div>
    </div>
  );
};


export default Usuarios;
