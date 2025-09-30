import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, BookOpen, LogOut } from 'lucide-react'
import { navItems } from './AdminNav'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-lg font-bold text-primary"
          >
            <BookOpen className="h-6 w-6" />
            <span>Subjects Admin</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b px-6 mb-4">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-lg font-bold text-primary"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span>Subjects Admin</span>
                  </Link>
                </div>
                <nav className="flex-1 px-4">
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
                            onClick={() => setOpen(false)}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors',
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
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
