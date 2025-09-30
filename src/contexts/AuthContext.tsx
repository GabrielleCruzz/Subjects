import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { authService } from '@/services/authService'
import { updateUser as apiUpdateUser } from '@/services/api'
import { LoginCredentials, RegisterCredentials, User } from '@/types'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (credentials: LoginCredentials) => Promise<User>
  register: (credentials: RegisterCredentials) => Promise<User>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select(
            'id, name, email, role, avatarUrl:avatar_url, series, institution, score, registeredAt:registered_at',
          )
          .eq('id', session.user.id)
          .single()
        setUser(profile)
      }
      setIsLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select(
            'id, name, email, role, avatarUrl:avatar_url, series, institution, score, registeredAt:registered_at',
          )
          .eq('id', session.user.id)
          .single()
        setUser(profile)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const user = await authService.login(
      credentials.email,
      credentials.password || '',
    )
    
    // Atualiza o estado do usuário imediatamente para casos onde a sessão não foi estabelecida
    setUser(user)
    
    return user
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    return await authService.register(credentials)
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const updateUser = useCallback(
    async (data: Partial<User>) => {
      if (!user) return
      try {
        const updatedUser = await apiUpdateUser(user.id, data)
        setUser(updatedUser)
      } catch (error) {
        console.error('Failed to update user:', error)
        throw error
      }
    },
    [user],
  )

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      login,
      register,
      logout,
      updateUser,
      isLoading,
    }),
    [user, login, register, logout, updateUser, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
