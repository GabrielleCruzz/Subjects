import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users, Video, Gamepad2, MessageSquare, PlayCircle } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChartContainer } from '@/components/ui/chart'

const stats = [
  {
    title: 'Usuários Registrados',
    value: '15,890',
    icon: Users,
    description: '+20.1% desde o último mês',
  },
  {
    title: 'Vídeos na Plataforma',
    value: '238',
    icon: Video,
    description: '+12 vídeos esta semana',
  },
  {
    title: 'Jogos Disponíveis',
    value: '5',
    icon: Gamepad2,
    description: '+1 jogo este mês',
  },
  {
    title: 'Total de Comentários',
    value: '1,235',
    icon: MessageSquare,
    description: '+50 novos comentários hoje',
  },
  {
    title: 'Visualizações de Vídeos',
    value: '1.2M',
    icon: PlayCircle,
    description: 'Total de visualizações',
  },
]

const userGrowthData = [
  { month: 'Jan', users: 400 },
  { month: 'Fev', users: 300 },
  { month: 'Mar', users: 500 },
  { month: 'Abr', users: 780 },
  { month: 'Mai', users: 600 },
  { month: 'Jun', users: 900 },
]

const recentActivities = [
  {
    user: 'Mariana Costa',
    avatar: 'female',
    seed: 5,
    activity: 'registrou-se na plataforma.',
  },
  {
    user: 'Carlos Silva',
    avatar: 'male',
    seed: 2,
    activity: 'postou um novo vídeo: "Revolução Francesa".',
  },
  {
    user: 'Ana Julia',
    avatar: 'female',
    seed: 1,
    activity: 'comentou no vídeo "Introdução à Álgebra".',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Usuários</CardTitle>
            <CardDescription>
              Novos usuários nos últimos 6 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
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
                    dataKey="users"
                    name="Novos Usuários"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Atividade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.user}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://img.usecurling.com/ppl/thumbnail?gender=${activity.avatar}&seed=${activity.seed}`}
                          />
                          <AvatarFallback>
                            {activity.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{activity.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.activity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
