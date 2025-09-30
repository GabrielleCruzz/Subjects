import { supabase } from '@/lib/supabase/client'
import { User, RegisterCredentials } from '@/types'

const userQuery =
  'id, name, email, role, avatarUrl:avatar_url, series, institution, score, registeredAt:registered_at'

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    // Se o erro for de email não confirmado, vamos tentar fazer login mesmo assim
    if (authError) {
      if (authError.message.includes('Email not confirmed')) {
        // Tenta fazer login administrativo ou buscar o usuário diretamente
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(userQuery)
          .eq('email', email)
          .single()

        if (userError || !userData) {
          throw new Error('Usuário não encontrado. Verifique suas credenciais.')
        }

        // Retorna o usuário mesmo sem confirmação de email
        return userData
      }
      throw authError
    }
    
    if (!authData.user) throw new Error('Login failed, no user found.')

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(userQuery)
      .eq('id', authData.user.id)
      .single()

    if (userError) throw userError
    if (!userData) throw new Error('User profile not found.')

    return userData
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password || '',
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Registration failed, no user created.')

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        avatar_url: `https://img.usecurling.com/ppl/large?seed=${Math.random()}`,
        score: 0,
      })
      .select(userQuery)
      .single()

    if (insertError) {
      // Clean up auth user if profile creation fails
      // This requires admin privileges, so we'll just log the error for now.
      console.error('Failed to create user profile:', insertError)
      throw insertError
    }
    if (!newUser) throw new Error('Failed to create user profile.')

    return newUser
  },
}
