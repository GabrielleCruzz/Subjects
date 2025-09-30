import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Book, Play, Trophy, Users, LucideIcon } from 'lucide-react'
import { ChartContainer } from '@/components/ui/chart'
import { getDashboardData } from '@/services/api'
import { DashboardData } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'

const iconComponents: { [key: string]: LucideIcon } = {
  Book,
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 animate-fade-in-down">
        Olá, {user?.name || 'Usuário'}!
      </h1>
      <p className="text-muted-foreground mb-8">
        Bem-vindo de volta ao seu painel de aprendizado.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Progresso</CardTitle>
              <CardDescription>
                Seu progresso geral em todas as disciplinas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-20" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">
                      {dashboardData?.progress}%
                    </span>
                    <div className="w-full">
                      <Progress
                        value={dashboardData?.progress}
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Continue assim!
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="link" className="px-0 mt-2">
                    <Link to="/profile">Ver Progresso Completo</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continuar Aprendendo</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full sm:w-32" />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {dashboardData?.continueLearning.topicName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dashboardData?.continueLearning.subjectName}
                    </p>
                  </div>
                  <Button asChild className="w-full sm:w-auto">
                    <Link
                      to={`/subjects/${dashboardData?.continueLearning.subjectId}`}
                    >
                      <Play className="mr-2 h-4 w-4" /> Continuar
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Disciplinas em Destaque
            </h2>
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem
                        key={index}
                        className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                      >
                        <Card className="h-full">
                          <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))
                  : dashboardData?.subjects.map((subject) => {
                      const Icon = iconComponents[subject.icon] || Book
                      return (
                        <CarouselItem
                          key={subject.id}
                          className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                          <Card className="h-full">
                            <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                              <Icon className="h-10 w-10 text-primary" />
                              <h3 className="font-semibold">{subject.name}</h3>
                              <Button
                                asChild
                                variant="outline"
                                className="w-full"
                              >
                                <Link to={`/subjects/${subject.id}`}>
                                  Ver Disciplina
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      )
                    })}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Seu Lugar no Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-20" />
                  </div>
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Posição Semanal
                    </p>
                    <p className="text-5xl font-bold">
                      {
                        dashboardData?.rankingEvolution.find(
                          (r) => r.name === 'Hoje',
                        )?.position
                      }
                      º
                    </p>
                  </div>
                  <div className="h-40 mt-4">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dashboardData?.rankingEvolution}
                          margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                          }}
                        >
                          <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            reversed={true}
                            domain={['dataMin - 5', 'dataMax + 5']}
                          />
                          <Tooltip
                            cursor={{ fill: 'hsl(var(--accent))' }}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              borderColor: 'hsl(var(--border))',
                            }}
                          />
                          <Bar
                            dataKey="position"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link to="/ranking">
                      <Trophy className="mr-2 h-4 w-4" /> Ver Ranking Completo
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Novidades da Comunidade</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              ) : (
                <>
                  <ul className="space-y-3 text-sm">
                    {dashboardData?.communityNews.map((post, index) => (
                      <li key={index} className="truncate">
                        <strong>{post.user}:</strong> {post.text}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full mt-4">
                    <Link to="/community">
                      <Users className="mr-2 h-4 w-4" /> Ir para Comunidade
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
