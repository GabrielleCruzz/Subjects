import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, BookOpen, User, LogOut, Shield, SunMoon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

const Logo = () => (
  <Link
    to="/"
    className="flex items-center gap-2 text-2xl font-bold text-primary transition-transform hover:scale-105"
  >
    <BookOpen className="h-7 w-7" />
    <span>Subjects</span>
  </Link>
)

const PreLoginNav = () => (
  <>
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      <a
        href="/#features"
        className="text-foreground/80 transition-colors hover:text-foreground"
      >
        Recursos
      </a>
      <a
        href="/#about"
        className="text-foreground/80 transition-colors hover:text-foreground"
      >
        Sobre Nós
      </a>
      <a
        href="/#contact"
        className="text-foreground/80 transition-colors hover:text-foreground"
      >
        Contato
      </a>
    </nav>
    <div className="hidden md:flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link to="/login">Entrar</Link>
      </Button>
      <Button asChild>
        <Link to="/register">Cadastre-se</Link>
      </Button>
    </div>
  </>
)

const PostLoginNav = () => {
  const { logout, user } = useAuth()
  const { setTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const roleDisplay: Record<string, string> = {
    student: 'Aluno',
    teacher: 'Professor',
    admin: 'Admin',
  }

  return (
    <>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          to="/dashboard"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Início
        </Link>
        <Link
          to="/videos"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Vídeos
        </Link>
        <Link
          to="/quizzes"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Quizzes
        </Link>
        <Link
          to="/tasks"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Tarefas
        </Link>
        <Link
          to="/games"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Jogos
        </Link>
        <Link
          to="/ranking"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Ranking
        </Link>
        <Link
          to="/community"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Comunidade
        </Link>
      </nav>
      <div className="hidden md:flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role ? roleDisplay[user.role] : ''}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Link>
            </DropdownMenuItem>
            {user?.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SunMoon className="mr-2 h-4 w-4" />
                <span>Tema</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  Sistema
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, logout, isLoading, user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between">
          <Skeleton className="h-8 w-36" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="md:hidden">
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b bg-background/90 backdrop-blur-sm shadow-subtle'
          : 'bg-background',
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Logo />
        {isAuthenticated ? <PostLoginNav /> : <PreLoginNav />}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-6 text-lg font-medium flex-grow">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard">Início</Link>
                      <Link to="/videos">Vídeos</Link>
                      <Link to="/quizzes">Quizzes</Link>
                      <Link to="/tasks">Tarefas</Link>
                      <Link to="/games">Jogos</Link>
                      <Link to="/ranking">Ranking</Link>
                      <Link to="/community">Comunidade</Link>
                      <Link to="/profile">Perfil</Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center">
                          <Shield className="mr-2 h-5 w-5" /> Admin
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <a href="/#features">Recursos</a>
                      <a href="/#about">Sobre Nós</a>
                      <a href="/#contact">Contato</a>
                      <div className="flex flex-col gap-4 pt-6">
                        <Button variant="ghost" asChild size="lg">
                          <Link to="/login">Entrar</Link>
                        </Button>
                        <Button asChild size="lg">
                          <Link to="/register">Cadastre-se</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
                <div className="mt-auto">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-4">
                      <ThemeToggle />
                      <Button variant="destructive" onClick={logout}>
                        Sair
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
