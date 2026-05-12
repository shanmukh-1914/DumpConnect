import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import useStore from '../../store/useStore'

export default function Reports(){
  const municipalCorporations = useStore(s => s.municipalCorporations)

  const data = municipalCorporations.map(a => ({ name: a.name, requests: a.requests || 0 }))

  return (
    <div className="space-y-4">
      <div className="glass p-4">
        <h3 className="font-medium">Corporation-wise Requests</h3>
        <div style={{ width: '100%', height: 220 }} className="mt-2">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="requests" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
