import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Star, Zap, Skull } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Quiz, Difficulty } from '@/types'
import { getQuizzes } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'

const difficultyConfig = {
  Fácil: { icon: Star, color: 'bg-green-500' },
  Médio: { icon: Zap, color: 'bg-yellow-500' },
  Difícil: { icon: Zap, color: 'bg-orange-500' },
  Impossível: { icon: Skull, color: 'bg-red-500' },
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true)
      try {
        const data = await getQuizzes()
        setQuizzes(data)
      } catch (error) {
        console.error('Failed to fetch quizzes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Central de Quizzes</h1>
        <p className="text-muted-foreground mt-2">
          Teste seus conhecimentos e ganhe pontos!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="flex flex-col justify-between">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          : quizzes.map((quiz) => {
              const Icon = difficultyConfig[quiz.difficulty].icon
              const color = difficultyConfig[quiz.difficulty].color
              return (
                <Card
                  key={quiz.id}
                  className="flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{quiz.title}</CardTitle>
                      <Badge
                        className={cn(
                          'flex items-center gap-1 text-white',
                          color,
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>
                      {quiz.subject} - {quiz.questions.length} questões
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Pronto para testar seus conhecimentos sobre {quiz.subject}
                      ?
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/quiz/${quiz.id}`}>
                        <HelpCircle className="mr-2 h-4 w-4" /> Começar Quiz
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
      </div>
    </div>
  )
}
