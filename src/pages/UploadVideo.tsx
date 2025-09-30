import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { UploadCloud } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { createVideo, uploadVideoFile, uploadThumbnail } from '@/services/api'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB (limite do Supabase free tier)
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
]

const videoSchema = z.object({
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
      `O tamanho máximo do arquivo é 50MB.`,
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      'Formatos de vídeo suportados: .mp4, .webm, .ogg, .mov, .avi',
    ),
})

type VideoFormValues = z.infer<typeof videoSchema>

export default function UploadVideo() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '',
      description: '',
      subject: undefined,
    },
  })

  const onSubmit = async (data: VideoFormValues) => {
    if (!user) return
    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Step 1: Upload video file
      setUploadProgress(20)
      const videoFile = data.videoFile[0]
      const videoUrl = await uploadVideoFile(videoFile)
      
      // Step 2: Generate thumbnail
      setUploadProgress(60)
      const thumbnailUrl = await uploadThumbnail(data.title, data.subject)
      
      // Step 3: Create video record
      setUploadProgress(80)
      await createVideo({
        title: data.title,
        description: data.description,
        subject: data.subject,
        videoUrl,
        uploaderId: user.id,
        likes: 0,
        views: 0,
        thumbnailUrl,
      })

      setUploadProgress(100)
      toast({
        title: 'Vídeo Enviado!',
        description: 'Seu vídeo foi enviado com sucesso para a plataforma.',
      })
      navigate('/videos')
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar vídeo',
        description: 'Falha no upload. Tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Postar Novo Vídeo</CardTitle>
          <CardDescription>
            Compartilhe seu conhecimento com a comunidade Subjects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Vídeo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Equações de 2º Grau"
                        {...field}
                        disabled={isSubmitting}
                      />
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
                        placeholder="Descreva o conteúdo do seu vídeo."
                        rows={4}
                        {...field}
                        disabled={isSubmitting}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Matemática">Matemática</SelectItem>
                        <SelectItem value="Português">Português</SelectItem>
                        <SelectItem value="História">História</SelectItem>
                        <SelectItem value="Geografia">Geografia</SelectItem>
                        <SelectItem value="Física">Física</SelectItem>
                        <SelectItem value="Química">Química</SelectItem>
                        <SelectItem value="Biologia">Biologia</SelectItem>
                        <SelectItem value="Inglês">Inglês</SelectItem>
                        <SelectItem value="Filosofia">Filosofia</SelectItem>
                        <SelectItem value="Sociologia">Sociologia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoFile"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Arquivo de Vídeo</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <Input
                          type="file"
                          accept={ACCEPTED_VIDEO_TYPES.join(',')}
                          onChange={(e) => onChange(e.target.files)}
                          disabled={isSubmitting}
                          className="hidden"
                          id="video-upload"
                          {...field}
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer"
                        >
                          <div className="text-sm text-muted-foreground">
                            <span className="font-semibold text-primary hover:text-primary/80">
                              Clique para enviar
                            </span>{' '}
                            ou arraste e solte
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            MP4, WebM, OGG, MOV ou AVI (máx. 500MB)
                          </div>
                        </label>
                        {value && value[0] && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            Arquivo selecionado: {value[0].name}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Envie um vídeo educativo de alta qualidade.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enviando vídeo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Enviando...' : 'Enviar Vídeo'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
