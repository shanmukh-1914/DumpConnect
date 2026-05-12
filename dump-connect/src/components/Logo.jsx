export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
        ♻️
      </div>
      <span className="font-semibold text-lg">DumpConnect</span>
    </div>
  )
}
