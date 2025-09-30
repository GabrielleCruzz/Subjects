import {
  LayoutDashboard,
  Users,
  Clapperboard,
  Trophy,
  Home,
} from 'lucide-react'

export const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'Usuários',
    icon: Users,
  },
  {
    href: '/admin/content',
    label: 'Conteúdo',
    icon: Clapperboard,
  },
  {
    href: '/admin/ranking',
    label: 'Ranking',
    icon: Trophy,
  },
  {
    href: '/',
    label: 'Voltar ao Site',
    icon: Home,
  },
]
