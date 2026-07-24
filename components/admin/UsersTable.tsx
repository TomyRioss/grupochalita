'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  createdAt: string
}

interface Props {
  users: User[]
  sessionRole: string
  sessionId: string
}

const emptyForm = { name: '', email: '', password: '', role: 'ADMIN' as 'ADMIN' | 'SUPER_ADMIN' }

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

export default function UsersTable({ users: initial, sessionRole, sessionId }: Props) {
  const router = useRouter()
  const [users, setUsers] = useState(initial)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<User | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showBanner(type: 'success' | 'error', message: string) {
    setBanner({ type, message })
    setTimeout(() => setBanner(null), 3500)
  }

  function openCreate() {
    setForm(emptyForm)
    setSelected(null)
    setModal('create')
  }

  function openEdit(u: User) {
    setForm({ name: u.name ?? '', email: u.email, password: '', role: u.role })
    setSelected(u)
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const isEdit = modal === 'edit'
      const url = isEdit ? `/api/admin/usuarios/${selected!.id}` : '/api/admin/usuarios'
      const method = isEdit ? 'PATCH' : 'POST'
      const body: Record<string, string> = { ...form }
      if (isEdit && !body.password) delete body.password

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }

      if (isEdit) {
        setUsers(prev => prev.map(u => u.id === data.id ? data : u))
        showBanner('success', 'Usuario actualizado')
      } else {
        setUsers(prev => [data, ...prev])
        showBanner('success', 'Usuario creado')
      }
      closeModal()
      router.refresh()
    } catch {
      showBanner('error', 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/usuarios/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
      showBanner('success', 'Usuario eliminado')
      setDeleteTarget(null)
      router.refresh()
    } catch {
      showBanner('error', 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const isSuperAdmin = sessionRole === 'SUPER_ADMIN'

  return (
    <>
      {/* Banner */}
      {banner && (
        <div className={`mx-6 mb-3 px-4 py-3 rounded-lg text-sm font-medium ${banner.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {banner.message}
        </div>
      )}

      {/* Action bar */}
      <div className="px-6 mb-4 flex items-center justify-between">
        <span className="text-sm text-[#8A7A50]">{users.length} usuario{users.length !== 1 ? 's' : ''}</span>
        <Button onClick={openCreate} className="bg-[#B8912A] text-white hover:bg-[#a3801f]">
          + Nuevo usuario
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white border border-[#E3D9B8] rounded-xl w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAF7EF] text-[#B8912A] border-b border-[#E3D9B8]">
              {['Nombre', 'Email', 'Rol', 'Creado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={`border-b border-[#E3D9B8] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF7EF]'}`}>
                <td className="px-4 py-3 font-medium text-[#2A2410]">{u.name ?? '—'}</td>
                <td className="px-4 py-3 text-[#4A4020]">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'SUPER_ADMIN' ? 'bg-[#B8912A]/15 text-[#B8912A]' : 'bg-[#E3D9B8]/50 text-[#4A4020]'}`}>
                    {u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8A7A50] whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                      Editar
                    </Button>
                    {u.id !== sessionId && (
                      <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(u)}>
                        Eliminar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#8A7A50]">Sin usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3 px-4">
        {users.map(u => (
          <div key={u.id} className="bg-white border border-[#E3D9B8] rounded-xl shadow-sm p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-[#2A2410]">{u.name ?? '—'}</div>
                <div className="text-xs text-[#8A7A50]">{u.email}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'SUPER_ADMIN' ? 'bg-[#B8912A]/15 text-[#B8912A]' : 'bg-[#E3D9B8]/50 text-[#4A4020]'}`}>
                {u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <div className="text-xs text-[#8A7A50]">{fmtDate(u.createdAt)}</div>
            <div className="flex gap-2 flex-wrap mt-1">
              <Button size="sm" variant="outline" onClick={() => openEdit(u)}>Editar</Button>
              {u.id !== sessionId && (
                <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(u)}>Eliminar</Button>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center text-[#8A7A50] py-8">Sin usuarios</div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeModal}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-xl bg-white border border-[#E3D9B8]" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-5 text-[#2A2410]">
              {modal === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#8A7A50]">Nombre</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-[#E3D9B8] text-sm text-[#2A2410] outline-none focus:ring-2 focus:ring-[#B8912A]"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#8A7A50]">Email *</label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 rounded-lg border border-[#E3D9B8] text-sm text-[#2A2410] outline-none focus:ring-2 focus:ring-[#B8912A]"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#8A7A50]">
                  {modal === 'edit' ? 'Contraseña (vacío = no cambiar)' : 'Contraseña *'}
                </label>
                <input
                  required={modal === 'create'}
                  type="password"
                  className="w-full px-3 py-2 rounded-lg border border-[#E3D9B8] text-sm text-[#2A2410] outline-none focus:ring-2 focus:ring-[#B8912A]"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#8A7A50]">Rol</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-[#E3D9B8] text-sm text-[#2A2410] outline-none"
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value as 'ADMIN' | 'SUPER_ADMIN' }))}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-3 mt-2">
                <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
                <Button type="submit" disabled={loading} className="bg-[#B8912A] text-white hover:bg-[#a3801f]">
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl bg-white border border-[#E3D9B8]" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-2 text-[#2A2410]">Eliminar usuario</h2>
            <p className="text-sm mb-5 text-[#4A4020]">
              ¿Confirmás que querés eliminar a <strong>{deleteTarget.name ?? deleteTarget.email}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button variant="destructive" disabled={loading} onClick={handleDelete}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
