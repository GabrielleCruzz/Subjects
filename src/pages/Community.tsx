import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp, MessageSquare, Search, PlusCircle, Send } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CommunityPost, User, CommunityComment } from '@/types'
import { 
  getUsers, 
  getCommunityPosts, 
  createCommunityPost, 
  likeCommunityPost, 
  addCommunityComment 
} from '@/services/api'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/use-toast'

export default function Community() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentTexts, setCommentTexts] = useState<{ [postId: string]: string }>({})
  const [showComments, setShowComments] = useState<{ [postId: string]: boolean }>({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [usersData, postsData] = await Promise.all([
          getUsers(),
          getCommunityPosts(),
        ])
        setUsers(usersData)
        setPosts(postsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast({
          title: 'Erro',
          description: 'Falha ao carregar dados da comunidade',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  const getUserById = (id: string | null) => {
    if (!id) return null
    return users.find((u) => u.id === id)
  }

  const handleCreatePost = async () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: 'Erro',
        description: 'Título e conteúdo são obrigatórios',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const newPost = await createCommunityPost({
        userId: user.id,
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        timestamp: new Date().toISOString(),
        likes: [],
        comments: [],
      })
      
      setPosts([newPost, ...posts])
      setNewPostTitle('')
      setNewPostContent('')
      setIsDialogOpen(false)
      
      toast({
        title: 'Sucesso',
        description: 'Publicação criada com sucesso!',
      })
    } catch (error) {
      console.error('Failed to create post:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao criar publicação',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para dar like',
        variant: 'destructive',
      })
      return
    }

    try {
      const updatedPost = await likeCommunityPost(postId, user.id)
      setPosts(posts.map(p => p.id === postId ? updatedPost : p))
    } catch (error) {
      console.error('Failed to like post:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao dar like',
        variant: 'destructive',
      })
    }
  }

  const handleComment = async (postId: string) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para comentar',
        variant: 'destructive',
      })
      return
    }

    const commentText = commentTexts[postId]?.trim()
    if (!commentText) {
      toast({
        title: 'Erro',
        description: 'Digite um comentário',
        variant: 'destructive',
      })
      return
    }

    try {
      const updatedPost = await addCommunityComment(postId, user.id, commentText)
      setPosts(posts.map(p => p.id === postId ? updatedPost : p))
      setCommentTexts({ ...commentTexts, [postId]: '' })
      
      toast({
        title: 'Sucesso',
        description: 'Comentário adicionado!',
      })
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar comentário',
        variant: 'destructive',
      })
    }
  }

  const toggleComments = (postId: string) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">Comunidade Subjects</h1>
          <p className="text-muted-foreground mt-2">
            Conecte-se, tire dúvidas e colabore com outros estudantes.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!user}>
              <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Publicação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Publicação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Título da sua publicação" 
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="Escreva sua dúvida ou dica aqui..."
                rows={5}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <Button 
                onClick={handleCreatePost} 
                disabled={isSubmitting || !newPostTitle.trim() || !newPostContent.trim()}
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Buscar por tópicos ou posts..." className="pl-10" />
      </div>

      <div className="space-y-6">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-3/4 mt-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))
          : posts.map((post) => {
              const postUser = getUserById(post.userId)
              if (!postUser) return null
              
              const isLiked = user && post.likes.includes(user.id)
              
              return (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={postUser.avatarUrl || ''} />
                        <AvatarFallback>{postUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{postUser.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.timestamp
                            ? formatDistanceToNow(new Date(post.timestamp), {
                                addSuffix: true,
                                locale: ptBR,
                              })
                            : ''}
                        </p>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-4">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 border-t pt-4">
                    <div className="flex items-center gap-6 w-full">
                      <Button
                        variant={isLiked ? "default" : "ghost"}
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleLike(post.id)}
                        disabled={!user}
                      >
                        <ThumbsUp className="h-4 w-4" /> {post.likes.length}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageSquare className="h-4 w-4" />{' '}
                        {post.comments.length} Comentários
                      </Button>
                    </div>
                    
                    {/* Comment input */}
                    {user && (
                      <div className="flex gap-2 w-full">
                        <Input
                          placeholder="Escreva um comentário..."
                          value={commentTexts[post.id] || ''}
                          onChange={(e) => setCommentTexts({ 
                            ...commentTexts, 
                            [post.id]: e.target.value 
                          })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(post.id)
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          disabled={!commentTexts[post.id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Comments list */}
                    {showComments[post.id] && post.comments.length > 0 && (
                      <div className="space-y-3 w-full">
                        {post.comments.map((comment: CommunityComment) => {
                          const commentUser = getUserById(comment.userId)
                          if (!commentUser) return null
                          
                          return (
                            <div key={comment.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={commentUser.avatarUrl || ''} />
                                <AvatarFallback className="text-xs">
                                  {commentUser.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm">{commentUser.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {comment.timestamp
                                      ? formatDistanceToNow(new Date(comment.timestamp), {
                                          addSuffix: true,
                                          locale: ptBR,
                                        })
                                      : ''}
                                  </p>
                                </div>
                                <p className="text-sm mt-1">{comment.text}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
      </div>
    </div>
  )
}
