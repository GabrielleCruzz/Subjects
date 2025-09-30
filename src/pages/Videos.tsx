import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { PlusCircle, PlayCircle, Frown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Video, User } from '@/types'
import { getVideos, getUsers } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { VideoFilters } from '@/components/videos/VideoFilters'

// Mock categories as they are not in the DB
const CATEGORIES = [
  'Matemática',
  'Português',
  'História',
  'Ciências',
  'Geografia',
  'Física',
  'Química',
]

export default function Videos() {
  const { user } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState('recent')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [videosData, usersData] = await Promise.all([
          getVideos(),
          getUsers(),
        ])
        setVideos(videosData)
        setUsers(usersData)
      } catch (error) {
        console.error('Failed to fetch videos or users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getUploaderName = (uploaderId: string | null) => {
    if (!uploaderId) return 'Professor'
    return users.find((u) => u.id === uploaderId)?.name || 'Professor'
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setSortOrder('recent')
  }

  const filteredAndSortedVideos = videos
    .filter((video) => {
      const searchTermMatch =
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(video.subject)
      return searchTermMatch && categoryMatch
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'popular':
          return b.views - a.views
        case 'az':
          return a.title.localeCompare(b.title)
        case 'recent':
        default:
          // Assuming newer videos are added to the start of the array
          return 0
      }
    })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">Vídeos Educacionais</h1>
          <p className="text-muted-foreground mt-2">
            Aprenda com os melhores conteúdos em vídeo.
          </p>
        </div>
        {user?.role === 'teacher' && (
          <Button asChild>
            <Link to="/upload-video">
              <PlusCircle className="mr-2 h-4 w-4" /> Postar Vídeo
            </Link>
          </Button>
        )}
      </div>

      <VideoFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        clearFilters={clearFilters}
        categories={CATEGORIES}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedVideos.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
            >
              <Link to={`/videos/${video.id}`}>
                <CardHeader className="p-0">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getUploaderName(video.uploaderId)}
                  </p>
                </CardContent>
              </Link>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/videos/${video.id}`}>
                    <PlayCircle className="mr-2 h-4 w-4" /> Assistir
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Frown className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Nenhum vídeo encontrado com os critérios selecionados.
          </p>
          <Button variant="link" onClick={clearFilters} className="mt-2">
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
