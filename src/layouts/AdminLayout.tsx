import { ReactNode } from 'react'
import { LayoutDashboard, ClipboardCheck, Settings } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

interface AdminLayoutProps {
  children: ReactNode
}

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: LayoutDashboard,
    path: '/admin/dashboard'
  },
  {
    id: 'inspection',
    label: '점검 관리',
    icon: ClipboardCheck,
    path: '/admin/inspection'
  },
  {
    id: 'settings',
    label: '사용자 설정',
    icon: Settings,
    path: '/admin/settings'
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative">
      {/* Background decorative elements */}
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-800/50 backdrop-blur-sm border-r border-zinc-700/50">
          {/* Logo/Brand */}
          <div className="h-16 flex items-center justify-center border-b border-zinc-700/50">
            <h1 className="text-xl font-bold text-white">
              Admin Dashboard
            </h1>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#A099FF]/20 text-[#A099FF] border border-[#A099FF]/30'
                          : 'text-gray-300 hover:bg-zinc-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${
                        isActive ? 'text-[#A099FF]' : 'text-gray-400'
                      }`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-zinc-700/50 bg-zinc-800/30 backdrop-blur-sm">
            <div className="text-sm text-gray-400 text-center">
              Smart Glass Safety Check
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-zinc-800/30 backdrop-blur-sm border-b border-zinc-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                관리자 패널
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-zinc-900/50 p-6">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}