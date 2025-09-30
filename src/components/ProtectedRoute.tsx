import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const location = useLocation()

  const isAuthorized = user && allowedRoles.includes(user.role)

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAuthorized) {
      toast({
        variant: 'destructive',
        title: 'Acesso Negado',
        description: 'Você não tem permissão para acessar esta página.',
      })
    }
  }, [isLoading, isAuthenticated, isAuthorized, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/dashboard" replace />
}
