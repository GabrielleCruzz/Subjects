import { useState, FormEvent, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThumbsUp, Eye, PlayCircle, Send } from 'lucide-react'
import { Video, Comment, User } from '@/types'
import { 
  getVideos, 
  getComments, 
  getUsers, 
  createVideoComment, 
  toggleVideoLike,
  getUserVideoLikes,
  updateVideoViews 
} from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/use-toast'

export default function VideoDetail() {
  const { videoId } = useParams<{ videoId: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const [video, setVideo] = useState<Video | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!videoId) return
      setLoading(true)
      try {
        const [allVideos, allComments, allUsers] = await Promise.all([
          getVideos(),
          getComments(),
          getUsers(),
        ])
        const currentVideo = allVideos.find((v) => v.id === videoId)
        const videoComments = allComments.filter(
          (c) => c.videoId === videoId && c.status === 'Aprovado',
        )
        setVideo(currentVideo || null)
        setComments(videoComments)
        setUsers(allUsers)

        // Check if user has liked this video
        if (user && currentVideo) {
          const userLikes = await getUserVideoLikes(user.id)
          setIsLiked(userLikes.includes(currentVideo.id))
        }
      } catch (error) {
        console.error('Failed to fetch video details:', error)
        toast({
          title: 'Erro',
          description: 'Falha ao carregar detalhes do vídeo',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [videoId, user, toast])

  const getUploader = () => {
    if (!video || !video.uploaderId) return null
    return users.find((u) => u.id === video.uploaderId)
  }

  const getUser = (userId: string | null) => {
    if (!userId) return null
    return users.find((u) => u.id === userId)
  }

  const handlePlay = async () => {
    if (!isPlaying && video) {
      const newViews = video.views + 1
      try {
        const updatedVideo = await updateVideoViews(video.id, newViews)
        setVideo(updatedVideo)
      } catch (error) {
        console.error('Failed to update views:', error)
        // Still update locally if API fails
        setVideo({ ...video, views: newViews })
      }
    }
    setIsPlaying(true)
  }

  const handleLike = async () => {
    if (!video || !user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para dar like',
        variant: 'destructive',
      })
      return
    }

    if (isLiking) return // Prevent multiple simultaneous requests

    setIsLiking(true)
    try {
      const result = await toggleVideoLike(video.id, user.id)
      
      // Update local state
      setIsLiked(result.liked)
      setVideo({ ...video, likes: result.totalLikes })
      
      toast({
        title: result.liked ? 'Like adicionado!' : 'Like removido!',
        description: `Agora o vídeo tem ${result.totalLikes} likes`,
      })
    } catch (error) {
      console.error('Failed to toggle like:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar like',
        variant: 'destructive',
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para comentar',
        variant: 'destructive',
      })
      return
    }

    if (!newComment.trim() || !video) return

    setIsSubmittingComment(true)
    try {
      await createVideoComment(video.id, user.id, newComment.trim())
      setNewComment('')
      toast({
        title: 'Comentário enviado!',
        description: 'Seu comentário está aguardando moderação e aparecerá em breve.',
      })
    } catch (error) {
      console.error('Failed to create comment:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao enviar comentário',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
            <Skeleton className="h-8 w-3/4" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        Vídeo não encontrado.
      </div>
    )
  }

  const uploader = getUploader()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={16 / 9} className="bg-black">
              {isPlaying ? (
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-20 w-20 hover:bg-transparent"
                      onClick={handlePlay}
                    >
                      <PlayCircle className="h-20 w-20 text-white/80 hover:text-white transition-colors" />
                    </Button>
                  </div>
                </div>
              )}
            </AspectRatio>
          </Card>

          <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={uploader?.avatarUrl || ''} />
                <AvatarFallback>{uploader?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{uploader?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-5 w-5" />
                <span>{video.views.toLocaleString('pt-BR')} visualizações</span>
              </div>
              <Button
                variant={isLiked ? 'default' : 'outline'}
                onClick={handleLike}
                disabled={!user || isLiking}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {video.likes.toLocaleString('pt-BR')}
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground mt-6">{video.description}</p>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Comentários ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
                  <Textarea
                    placeholder="Adicione um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={1}
                    className="resize-none"
                    disabled={isSubmittingComment}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!newComment.trim() || isSubmittingComment}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <p className="text-muted-foreground text-sm mb-6">
                  Faça login para comentar
                </p>
              )}
              <div className="space-y-4">
                {comments.map((comment) => {
                  const commentUser = getUser(comment.userId)
                  if (!commentUser) return null
                  return (
                    <div key={comment.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={commentUser.avatarUrl || ''} />
                        <AvatarFallback>
                          {commentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">
                          {commentUser.name}
                          <span className="text-xs text-muted-foreground font-normal ml-2">
                            {comment.timestamp
                              ? formatDistanceToNow(
                                  new Date(comment.timestamp),
                                  {
                                    addSuffix: true,
                                    locale: ptBR,
                                  },
                                )
                              : ''}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
