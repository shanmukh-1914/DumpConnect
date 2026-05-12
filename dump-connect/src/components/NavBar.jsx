import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <div className="w-full p-4 flex items-center justify-between bg-transparent">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">DumpConnect</div>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/user" className="px-3 py-1 rounded bg-slate-700/40">User</Link>
        <Link to="/admin" className="px-3 py-1 rounded bg-slate-700/40">Admin</Link>
      </div>
    </div>
  )
}
