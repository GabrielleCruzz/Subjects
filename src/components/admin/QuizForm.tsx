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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const quizFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  subject: z
    .string()
    .min(3, { message: 'A disciplina deve ter pelo menos 3 caracteres.' }),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil', 'Impossível'], {
    required_error: 'Você precisa selecionar uma dificuldade.',
  }),
})

export type QuizFormValues = z.infer<typeof quizFormSchema>

interface QuizFormProps {
  onSubmit: (values: QuizFormValues) => void
  defaultValues?: Partial<QuizFormValues>
  isSubmitting: boolean
}

export const QuizForm = ({
  onSubmit,
  defaultValues,
  isSubmitting,
}: QuizFormProps) => {
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: defaultValues || {
      title: '',
      subject: '',
      difficulty: 'Fácil',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Quiz</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Equações de 1º Grau" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Matemática" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dificuldade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a dificuldade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                  <SelectItem value="Impossível">Impossível</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando...' : 'Salvar Quiz'}
        </Button>
      </form>
    </Form>
  )
}
