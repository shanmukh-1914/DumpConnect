import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [role, setRole] = useState('user')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // for prototype just navigate
    if (role === 'admin') navigate('/admin')
    else navigate('/user')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold">Create account</h2>
      <input placeholder="Full name" className="w-full p-2 rounded bg-slate-900 border border-slate-700" />
      <input placeholder="Email" className="w-full p-2 rounded bg-slate-900 border border-slate-700" />
      <input placeholder="Password" type="password" className="w-full p-2 rounded bg-slate-900 border border-slate-700" />
      <div className="flex items-center gap-3">
        <label className="text-sm">Role</label>
        <select value={role} onChange={(e)=>setRole(e.target.value)} className="p-2 rounded bg-slate-900">
          <option value="user">User / Citizen</option>
          <option value="admin">Municipal Admin</option>
        </select>
      </div>
      <button className="px-4 py-2 bg-primary rounded text-white">Create account</button>
    </form>
  )
}
