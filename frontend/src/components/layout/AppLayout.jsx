import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen relative z-[1]">
      <Sidebar />
      <main className="flex-1 ml-[220px] min-h-screen overflow-y-auto max-md:ml-16">
        <Outlet />
      </main>
    </div>
  )
}
