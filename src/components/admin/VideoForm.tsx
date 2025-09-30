import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
]

const videoFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z
    .string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
  subject: z.string({ required_error: 'Você precisa selecionar uma matéria.' }),
  videoFile: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'É necessário enviar um arquivo.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `O tamanho máximo do arquivo é 500MB.`,
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      'Formatos de vídeo suportados: .mp4, .webm, .ogg, .mov, .avi',
    ),
})

export type VideoFormValues = z.infer<typeof videoFormSchema>

interface VideoFormProps {
  onSubmit: (values: VideoFormValues) => void
  defaultValues?: Partial<VideoFormValues>
  isSubmitting: boolean
}

export const VideoForm = ({
  onSubmit,
  defaultValues,
  isSubmitting,
}: VideoFormProps) => {
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      subject: undefined,
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
              <FormLabel>Título do Vídeo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Introdução à Álgebra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o conteúdo do vídeo."
                  {...field}
                />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="Português">Português</SelectItem>
                  <SelectItem value="História">História</SelectItem>
                  <SelectItem value="Ciências">Ciências</SelectItem>
                  <SelectItem value="Geografia">Geografia</SelectItem>
                  <SelectItem value="Física">Física</SelectItem>
                  <SelectItem value="Química">Química</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoFile"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>Arquivo de Vídeo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_VIDEO_TYPES.join(',')}
                  onChange={(e) => onChange(e.target.files)}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Selecione um arquivo de vídeo (máx 500MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando...' : 'Salvar Vídeo'}
        </Button>
      </form>
    </Form>
  )
}
