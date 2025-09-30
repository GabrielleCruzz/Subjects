import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { PlayCircle, FileText, HelpCircle, CheckCircle } from 'lucide-react'

const mockContent = {
  videos: [
    { title: 'Introdução à Álgebra', duration: '12:34', watched: true },
    { title: 'Equações de 1º Grau', duration: '15:50', watched: true },
    { title: 'Sistemas de Equações', duration: '20:10', watched: false },
    { title: 'Funções do 1º Grau', duration: '18:22', watched: false },
  ],
  materials: [
    {
      title: 'Resumo de Fórmulas',
      description: 'PDF com as principais fórmulas de álgebra.',
    },
    {
      title: 'Exercícios Resolvidos',
      description: 'Passo a passo de 10 exercícios.',
    },
  ],
  quizzes: [
    {
      title: 'Quiz de Equações',
      questions: 10,
      completed: true,
      score: '8/10',
    },
    {
      title: 'Desafio de Funções',
      questions: 15,
      completed: false,
      score: null,
    },
  ],
}

export default function SubjectDetail() {
  const { subjectId } = useParams()
  const subjectName = subjectId
    ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1)
    : 'Disciplina'

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Matemática - {subjectName}</h1>
        <p className="text-muted-foreground mt-2">
          Explore todos os recursos disponíveis para dominar este tópico.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Seu Progresso em {subjectName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={50} className="h-3" />
            <span className="font-semibold">50%</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {mockContent.videos.map((video, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {video.watched ? (
                      <CheckCircle className="h-6 w-6 text-success" />
                    ) : (
                      <PlayCircle className="h-6 w-6 text-primary" />
                    )}
                    <div>
                      <p className="font-semibold">{video.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {video.duration}
                      </p>
                    </div>
                  </div>
                  <Button variant={video.watched ? 'secondary' : 'default'}>
                    {video.watched ? 'Revisar' : 'Assistir'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="materials" className="mt-6">
          <div className="grid gap-4">
            {mockContent.materials.map((material, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">{material.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {material.description}
                      </p>
                    </div>
                  </div>
                  <Button>Acessar</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="quizzes" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {mockContent.quizzes.map((quiz, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">{quiz.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {quiz.questions} questões
                      </p>
                    </div>
                  </div>
                  {quiz.completed ? (
                    <div className="text-right">
                      <p className="font-bold text-success">{quiz.score}</p>
                      <Button variant="secondary" size="sm" className="mt-1">
                        Revisar
                      </Button>
                    </div>
                  ) : (
                    <Button>Fazer Quiz</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
