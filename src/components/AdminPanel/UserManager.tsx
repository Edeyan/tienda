import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Role } from '../../types';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  Trash2, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  X,
  Save,
  Check,
  RefreshCw
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const { users, register, updateUserRole, toggleUserStatus, deleteUser, currentUser, refreshUsers, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New user form
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newRole, setNewRole] = useState<Role>('customer');
  const [newPhone, setNewPhone] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    return matchesRole && matchesSearch;
  });

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register({
      name: `${newFirstName} ${newLastName}`.trim(),
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      password: newPassword,
      role: newRole,
      phone: newPhone
    });
    if (!result.success) {
      showToast(result.message || 'No se pudo crear el usuario.', 'warning');
      return;
    }
    setIsAddingUser(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleRefreshUsers = async () => {
    setIsRefreshing(true);
    const result = await refreshUsers();
    if (!result.success) {
      showToast(result.message || 'No se pudieron cargar los usuarios.', 'error');
    } else {
      showToast('Usuarios actualizados desde Firebase.', 'success');
    }
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & New User Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-lg font-black text-[#002147]">Gestión de Usuarios y Accesos</h3>
          <p className="text-xs text-slate-500">Supervisa usuarios registrados, asigna roles de administración y vendedores</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRefreshUsers}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => setIsAddingUser(true)}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Usuario</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="search"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
        >
          <option value="all">Todos los Roles</option>
          <option value="admin">Administradores</option>
          <option value="seller">Vendedores</option>
          <option value="customer">Clientes</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Usuario</th>
                <th className="p-3.5">Contacto</th>
                <th className="p-3.5">Rol de Cuenta</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5">Registro</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No se encontraron usuarios coincidentes.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User name & avatar */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-[#002147] flex items-center gap-1.5">
                            {user.name}
                            {user.id === currentUser?.id && (
                              <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 rounded font-mono font-bold">
                                Tú
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-3.5 text-slate-600">
                      <div className="font-mono text-[11px]">{user.phone || 'No registrado'}</div>
                      <div className="text-[10px] text-slate-400">{user.country || 'España'}</div>
                    </td>

                    {/* Role selector dropdown */}
                    <td className="p-3.5">
                      <select
                        value={user.role}
                        onChange={e => updateUserRole(user.id, e.target.value as Role)}
                        className={`text-[10px] font-extrabold px-2 py-1 rounded-xl uppercase border ${
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : user.role === 'seller'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        } focus:outline-none focus:ring-1 focus:ring-orange-500`}
                      >
                        <option value="customer">Cliente</option>
                        <option value="seller">Vendedor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase transition-all ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-500 text-[11px] font-mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          if (user.id === currentUser?.id) {
                            alert('No puedes eliminar tu propio usuario en sesión activa.');
                            return;
                          }
                          if (confirm(`¿Eliminar la cuenta de ${user.name}?`)) {
                            void deleteUser(user.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 bg-[#002147] text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-orange-500 rounded-xl text-white">
                  <UserPlus className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black">Registrar Nuevo Usuario</h3>
              </div>
              <button
                onClick={() => setIsAddingUser(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={e => setNewFirstName(e.target.value)}
                    placeholder="Carlos"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={e => setNewLastName(e.target.value)}
                    placeholder="Mendoza"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contraseña Inicial *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rol en la Plataforma *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'customer', label: 'Cliente' },
                    { id: 'seller', label: 'Vendedor' },
                    { id: 'admin', label: 'Admin' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setNewRole(r.id as Role)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        newRole === r.id
                          ? 'bg-[#002147] text-white border-[#002147] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
