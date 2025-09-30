import { useState, useEffect } from 'react'
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
import { Button } from '@/components/ui/button'
import { Check, X, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Comment, Video } from '@/types'
import {
  getComments,
  getVideos,
  updateCommentStatus,
  deleteComment,
} from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '../ui/badge'
import { useToast } from '../ui/use-toast'

export const CommentModerationSection = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  const fetchModerationData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const [allVideos, allComments] = await Promise.all([
        getVideos(),
        getComments(),
      ])
      const userVideoIds = allVideos
        .filter((v) => v.uploaderId === user.id)
        .map((v) => v.id)
      const userComments = allComments.filter(
        (c) => c.videoId && userVideoIds.includes(c.videoId),
      )
      setVideos(allVideos)
      setComments(userComments)
    } catch (error) {
      console.error('Failed to fetch moderation data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModerationData()
  }, [user])

  const handleStatusChange = async (id: string, status: Comment['status']) => {
    try {
      await updateCommentStatus(id, status)
      toast({ title: 'Status do comentário atualizado!' })
      fetchModerationData()
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status do comentário.',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id)
      toast({
        variant: 'destructive',
        title: 'Comentário excluído com sucesso!',
      })
      fetchModerationData()
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao excluir comentário.' })
    }
  }

  const getVideoTitle = (videoId: string | null) => {
    if (!videoId) return 'Vídeo Desconhecido'
    return videos.find((v) => v.id === videoId)?.title || 'Vídeo Desconhecido'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderação de Comentários</CardTitle>
        <CardDescription>
          Aprove, rejeite ou exclua comentários em seus vídeos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comentário</TableHead>
                <TableHead>Vídeo</TableHead>
                <TableHead>Status</TableHead>
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
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-xs truncate">
                        {comment.text}
                      </TableCell>
                      <TableCell>{getVideoTitle(comment.videoId)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            comment.status === 'Aprovado'
                              ? 'default'
                              : comment.status === 'Rejeitado'
                                ? 'destructive'
                                : 'outline'
                          }
                          className={
                            comment.status === 'Aprovado' ? 'bg-success' : ''
                          }
                        >
                          {comment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusChange(comment.id, 'Aprovado')
                          }
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusChange(comment.id, 'Rejeitado')
                          }
                        >
                          <X className="h-4 w-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(comment.id)}
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
  )
}
