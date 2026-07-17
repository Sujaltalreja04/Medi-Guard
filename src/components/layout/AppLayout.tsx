import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div className="flex h-screen" style={{ background: '#0a0f1e' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ background: '#0a0f1e' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
