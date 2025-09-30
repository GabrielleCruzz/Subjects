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
import { Badge } from '@/components/ui/badge'
import { HelpCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Task } from '@/types'
import { getTasks } from '@/services/api'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export const HistorySection = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return
      setLoading(true)
      try {
        const userTasks = await getTasks(user.id)
        setTasks(userTasks)
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atividades</CardTitle>
        <CardDescription>
          Suas atividades mais recentes na plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Atividade</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : tasks.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-muted-foreground" />
                          <span className="capitalize">Tarefa</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'completed' ? 'default' : 'outline'
                          }
                          className={
                            item.status === 'completed' ? 'bg-success' : ''
                          }
                        >
                          {item.status === 'completed'
                            ? 'Concluída'
                            : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.dueDate
                          ? format(new Date(item.dueDate), 'dd/MM/yyyy')
                          : '-'}
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
