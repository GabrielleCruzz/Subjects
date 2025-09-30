import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChartContainer } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { BookOpenCheck, HelpCircle, Trophy, Star, Info } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const subjectProgressData = [
  { subject: 'Matemática', progress: 75 },
  { subject: 'Português', progress: 60 },
  { subject: 'História', progress: 85 },
  { subject: 'Ciências', progress: 50 },
]

const weeklyPerformanceData = [
  { day: 'Seg', score: 250 },
  { day: 'Ter', score: 300 },
  { day: 'Qua', score: 450 },
  { day: 'Qui', score: 200 },
  { day: 'Sex', score: 600 },
  { day: 'Sáb', score: 800 },
  { day: 'Dom', score: 150 },
]

export const PerformanceSection = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pontuação Total
            </CardTitle>
            <Star className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">
              {user?.score?.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">pontos acumulados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Posição no Ranking
            </CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{user?.rank}º</div>
            <Button asChild variant="link" className="px-0 -ml-1 text-sm">
              <Link to="/ranking">Ver ranking completo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Progresso Geral por Disciplina</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectProgressData.map((item) => (
              <div key={item.subject}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.subject}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.progress}%
                  </span>
                </div>
                <Progress value={item.progress} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Desempenho nos Últimos 7 Dias</CardTitle>
            <CardDescription>Pontuação ganha por dia.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPerformanceData}>
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="score"
                    name="Pontos"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Vídeos Assistidos
            </CardTitle>
            <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Quizzes Concluídos
            </CardTitle>
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+2 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Como Pontuar?</CardTitle>
            <Info className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-2">
              Pontos são concedidos por suas atividades na plataforma.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground mt-2">
              <li>Vídeo completo: +50</li>
              <li>Acerto em quiz: +100</li>
              <li>Quiz completo: +250</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
