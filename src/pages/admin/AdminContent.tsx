import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, MoreHorizontal, Trash2, Check, X } from 'lucide-react'
import { VideoForm, VideoFormValues } from '@/components/admin/VideoForm'
import { QuizForm, QuizFormValues } from '@/components/admin/QuizForm'
import { useToast } from '@/components/ui/use-toast'
import { Video, Quiz, Comment } from '@/types'
import {
  getVideos,
  createVideo,
  deleteVideo,
  getQuizzes,
  createQuiz,
  deleteQuiz,
  getComments,
  updateCommentStatus,
  deleteComment,
} from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type DialogState = null | 'create-video' | 'create-quiz'
type ItemToDelete = null | { type: 'video' | 'quiz' | 'comment'; id: string }

export default function AdminContent() {
  const [videos, setVideos] = useState<Video[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState<DialogState>(null)
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [videosData, quizzesData, commentsData] = await Promise.all([
        getVideos(),
        getQuizzes(),
        getComments(),
      ])
      setVideos(videosData)
      setQuizzes(quizzesData)
      setComments(commentsData)
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar conteúdo' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleVideoSubmit = async (values: VideoFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await createVideo({
        title: values.title,
        description: values.description,
        subject: values.subject,
        videoUrl:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        uploaderId: 1,
        likes: 0,
        views: 0,
        thumbnailUrl: `https://img.usecurling.com/p/400/225?q=${encodeURIComponent(
          values.subject,
        )}`,
      })
      toast({ title: 'Vídeo adicionado com sucesso!' })
      fetchData()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao adicionar vídeo' })
    } finally {
      setIsSubmitting(false)
      setDialogOpen(null)
    }
  }

  const handleQuizSubmit = async (values: QuizFormValues) => {
    setIsSubmitting(true)
    try {
      await createQuiz({ ...values, questions: [] })
      toast({ title: 'Quiz criado com sucesso!' })
      fetchData()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao criar quiz' })
    } finally {
      setIsSubmitting(false)
      setDialogOpen(null)
    }
  }

  const handleCommentStatus = async (id: string, status: Comment['status']) => {
    try {
      await updateCommentStatus(id, status)
      toast({ title: `Comentário ${status.toLowerCase()} com sucesso!` })
      fetchData()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao moderar comentário' })
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    try {
      if (itemToDelete.type === 'video') await deleteVideo(itemToDelete.id)
      if (itemToDelete.type === 'quiz') await deleteQuiz(itemToDelete.id)
      if (itemToDelete.type === 'comment') await deleteComment(itemToDelete.id)
      toast({ title: 'Item excluído com sucesso!' })
      fetchData()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao excluir item' })
    } finally {
      setItemToDelete(null)
    }
  }

  const renderLoadingCards = () =>
    Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </Card>
    ))

  const renderLoadingRows = (cols: number) =>
    Array.from({ length: 3 }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-5 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Conteúdo</h1>
      <Tabs defaultValue="videos">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="videos" className="flex-1 sm:flex-none">
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex-1 sm:flex-none">
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex-1 sm:flex-none">
              Comentários
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setDialogOpen('create-video')}
              className="flex-1"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Vídeo
            </Button>
            <Button
              onClick={() => setDialogOpen('create-quiz')}
              className="flex-1"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Quiz
            </Button>
          </div>
        </div>
        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Vídeos</CardTitle>
              <CardDescription>
                Gerencie os vídeos da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="md:hidden space-y-4">
                {loading
                  ? renderLoadingCards()
                  : videos.map((video) => (
                      <Card key={video.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{video.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {video.subject}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  setItemToDelete({
                                    type: 'video',
                                    id: video.id,
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
              </div>
              <div className="relative w-full overflow-auto hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? renderLoadingRows(3)
                      : videos.map((video) => (
                          <TableRow key={video.id}>
                            <TableCell className="font-medium">
                              {video.title}
                            </TableCell>
                            <TableCell>{video.subject}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      setItemToDelete({
                                        type: 'video',
                                        id: video.id,
                                      })
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Quizzes</CardTitle>
              <CardDescription>
                Gerencie os quizzes da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="md:hidden space-y-4">
                {loading
                  ? renderLoadingCards()
                  : quizzes.map((quiz) => (
                      <Card key={quiz.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{quiz.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {quiz.subject}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  setItemToDelete({
                                    type: 'quiz',
                                    id: quiz.id,
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-2">
                          <Badge>{quiz.difficulty}</Badge>
                        </div>
                      </Card>
                    ))}
              </div>
              <div className="relative w-full overflow-auto hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Dificuldade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? renderLoadingRows(4)
                      : quizzes.map((quiz) => (
                          <TableRow key={quiz.id}>
                            <TableCell className="font-medium">
                              {quiz.title}
                            </TableCell>
                            <TableCell>{quiz.subject}</TableCell>
                            <TableCell>{quiz.difficulty}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      setItemToDelete({
                                        type: 'quiz',
                                        id: quiz.id,
                                      })
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
              <CardDescription>
                Modere os comentários dos vídeos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="md:hidden space-y-4">
                {loading
                  ? renderLoadingCards()
                  : comments.map((comment) => (
                      <Card key={comment.id} className="p-4">
                        <p className="text-sm text-muted-foreground truncate">
                          {comment.text}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge
                            variant={
                              comment.status === 'Aprovado'
                                ? 'default'
                                : comment.status === 'Rejeitado'
                                  ? 'destructive'
                                  : 'outline'
                            }
                            className={cn(
                              comment.status === 'Aprovado' && 'bg-success',
                            )}
                          >
                            {comment.status}
                          </Badge>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleCommentStatus(comment.id, 'Aprovado')
                              }
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleCommentStatus(comment.id, 'Rejeitado')
                              }
                            >
                              <X className="h-4 w-4 text-yellow-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setItemToDelete({
                                  type: 'comment',
                                  id: comment.id,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
              </div>
              <div className="relative w-full overflow-auto hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comentário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? renderLoadingRows(3)
                      : comments.map((comment) => (
                          <TableRow key={comment.id}>
                            <TableCell className="max-w-sm truncate">
                              {comment.text}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  comment.status === 'Aprovado'
                                    ? 'default'
                                    : comment.status === 'Rejeitado'
                                      ? 'destructive'
                                      : 'outline'
                                }
                                className={cn(
                                  comment.status === 'Aprovado' && 'bg-success',
                                )}
                              >
                                {comment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleCommentStatus(comment.id, 'Aprovado')
                                }
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleCommentStatus(comment.id, 'Rejeitado')
                                }
                              >
                                <X className="h-4 w-4 text-yellow-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setItemToDelete({
                                    type: 'comment',
                                    id: comment.id,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={dialogOpen === 'create-video'}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Vídeo</DialogTitle>
          </DialogHeader>
          <VideoForm onSubmit={handleVideoSubmit} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen === 'create-quiz'}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Quiz</DialogTitle>
          </DialogHeader>
          <QuizForm onSubmit={handleQuizSubmit} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={() => setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir
              este item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
