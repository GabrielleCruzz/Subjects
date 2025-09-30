import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Eye, ThumbsUp, MoreHorizontal, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Video } from '@/types'
import { getVideos, deleteVideo } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export const MyVideosSection = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null)

  const fetchVideos = async () => {
    if (!user) return
    setLoading(true)
    try {
      const allVideos = await getVideos()
      const userVideos = allVideos.filter((v) => v.uploaderId === user.id)
      setVideos(userVideos)
    } catch (error) {
      console.error('Failed to fetch user videos:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar vídeos.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [user, toast])

  const handleDelete = async () => {
    if (!videoToDelete) return
    try {
      await deleteVideo(videoToDelete.id)
      toast({
        title: 'Vídeo excluído!',
        description: `"${videoToDelete.title}" foi removido com sucesso.`,
      })
      fetchVideos()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir vídeo.',
      })
    } finally {
      setVideoToDelete(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Meus Vídeos</CardTitle>
          <CardDescription>
            Gerencie e acompanhe o desempenho dos seus vídeos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="text-center">Visualizações</TableHead>
                  <TableHead className="text-center">Likes</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-48" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-5 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-5 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">
                          <Button variant="link" asChild className="p-0 h-auto">
                            <Link to={`/videos/${video.id}`}>
                              {video.title}
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            {video.views}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            {video.likes}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setVideoToDelete(video)}
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
      <AlertDialog
        open={!!videoToDelete}
        onOpenChange={() => setVideoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o vídeo "
              <strong>{videoToDelete?.title}</strong>"? Esta ação não pode ser
              desfeita.
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
    </>
  )
}
