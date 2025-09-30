import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { DialogFooter, DialogClose } from '@/components/ui/dialog'

const passwordSchema = z
  .string()
  .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  .regex(/[a-z]/, {
    message: 'A senha deve conter pelo menos uma letra minúscula.',
  })
  .regex(/[A-Z]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula.',
  })
  .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'A senha deve conter pelo menos um caractere especial.',
  })

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'A senha atual é obrigatória.' }),
    newPassword: passwordSchema,
    confirmNewPassword: z
      .string()
      .min(1, { message: 'A confirmação da senha é obrigatória.' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As novas senhas não coincidem.',
    path: ['confirmNewPassword'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

interface ChangePasswordFormProps {
  onSuccess: () => void
}

export const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = (data: ChangePasswordFormValues) => {
    setIsSubmitting(true)
    // Mock API call
    setTimeout(() => {
      // Mocking incorrect password
      if (data.currentPassword !== 'password123') {
        form.setError('currentPassword', {
          type: 'manual',
          message: 'A senha atual está incorreta.',
        })
        setIsSubmitting(false)
        return
      }

      toast({
        title: 'Senha Alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      })
      setIsSubmitting(false)
      onSuccess()
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Atual</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
