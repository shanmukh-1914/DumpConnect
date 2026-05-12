import useStore from '../../store/useStore'
import { Link, useNavigate } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts'
import MapView from '../../components/MapView'

export default function AdminDashboard(){
  const navigate = useNavigate()
  const trucks = useStore(s => s.trucks)
  const requests = useStore(s => s.requests)
  const municipalCorporations = useStore(s => s.municipalCorporations)
  const logout = useStore(s => s.logout)

  const activeTrucks = trucks.filter(t => t.status === 'dispatched').length
  const pendingRequests = requests.filter(r => r.status === 'pending').length

  const sampleTrend = [
    {name: '6AM', v: 20}, {name: '9AM', v: 35}, {name: '12PM', v: 40}, {name: '3PM', v: 30}, {name: '6PM', v: 55}
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage waste collection operations and fleet</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/profile" className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:shadow-lg hover:shadow-primary/50 transition\">🏢 Municipal Profile</Link>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className=\"px-4 py-2 rounded-lg border border-slate-600 text-slate-100 font-medium hover:bg-slate-800/50 transition\"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4\">
        <div className=\"glass p-6 rounded-xl hover:border-primary/50 transition\">
          <div className=\"flex items-center justify-between mb-4\">
            <span className=\"text-3xl\">📋</span>
            <span className=\"px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400\">Overview</span>
          </div>
          <div className=\"text-sm text-slate-400\">Total Requests</div>
          <div className=\"text-3xl font-bold mt-2\">{requests.length}</div>
        </div>
        <div className=\"glass p-6 rounded-xl hover:border-primary/50 transition\">
          <div className=\"flex items-center justify-between mb-4\">
            <span className=\"text-3xl\">🚛</span>
            <span className=\"px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400\">Active</span>
          </div>
          <div className=\"text-sm text-slate-400\">Active Trucks</div>
          <div className=\"text-3xl font-bold mt-2\">{activeTrucks}/{trucks.length}</div>
        </div>
        <div className=\"glass p-6 rounded-xl hover:border-primary/50 transition\">
          <div className=\"flex items-center justify-between mb-4\">
            <span className=\"text-3xl\">⏳</span>
            <span className=\"px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400\">Pending</span>
          </div>
          <div className=\"text-sm text-slate-400\">Pending Requests</div>
          <div className=\"text-3xl font-bold mt-2\">{pendingRequests}</div>
        </div>
        <div className=\"glass p-6 rounded-xl hover:border-primary/50 transition\">
          <div className=\"flex items-center justify-between mb-4\">
            <span className=\"text-3xl\">🏛️</span>
            <span className=\"px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400\">Coverage</span>
          </div>
          <div className=\"text-sm text-slate-400\">Corporations</div>
          <div className=\"text-3xl font-bold mt-2\">{municipalCorporations.length}</div>
        </div>
      </div>

      <div className=\"grid lg:grid-cols-3 gap-4\">
        <div className=\"lg:col-span-2 glass p-6 rounded-xl\">
          <h4 className=\"font-bold text-lg mb-4 flex items-center gap-2\">📊 Request Trends</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={sampleTrend}>
                <defs>
                  <linearGradient id=\"colorV\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">
                    <stop offset=\"5%\" stopColor=\"#60a5fa\" stopOpacity={0.8}/>
                    <stop offset=\"95%\" stopColor=\"#60a5fa\" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey=\"name\" stroke=\"#64748b\" />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #475569'}} />
                <Area type=\"monotone\" dataKey=\"v\" stroke=\"#60a5fa\" fillOpacity={1} fill=\"url(#colorV)\" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className=\"glass p-6 rounded-xl space-y-4\">
          <h4 className=\"font-bold text-lg flex items-center gap-2\">⚡ Quick Links</h4>
          <Link to=\"/admin/profile\" className=\"block p-3 rounded-lg border border-slate-700 hover:border-primary hover:bg-slate-800/50 transition text-center font-medium\">
            View Profile
          </Link>
          <Link to=\"/admin/dispatch\" className=\"block p-3 rounded-lg border border-slate-700 hover:border-primary hover:bg-slate-800/50 transition text-center font-medium\">
            Send Trucks
          </Link>
          <Link to=\"/admin/requests\" className=\"block p-3 rounded-lg border border-slate-700 hover:border-primary hover:bg-slate-800/50 transition text-center font-medium\">
            Requests
          </Link>
          <Link to=\"/admin/reports\" className=\"block p-3 rounded-lg border border-slate-700 hover:border-primary hover:bg-slate-800/50 transition text-center font-medium\">
            Reports
          </Link>
        </div>
      </div>

      <div className=\"glass p-6 rounded-xl\">
        <h4 className=\"font-bold text-lg mb-4 flex items-center gap-2\">🗺️ Live Map Monitoring</h4>
        <MapView trucks={trucks} requests={requests} />
      </div>
    </div>
  )
}
