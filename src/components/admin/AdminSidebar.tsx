import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from './AdminNav'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center px-6">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <BookOpen className="h-6 w-6" />
            <span>Subjects Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href)
              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  )
}
