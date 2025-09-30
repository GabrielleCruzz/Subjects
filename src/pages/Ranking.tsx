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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { User } from '@/types'
import { getUsers } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

export default function Ranking() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const data = await getUsers()
        const sortedUsers = data
          .filter((u) => u.role !== 'admin')
          .sort((a, b) => b.score - a.score)
        setUsers(sortedUsers)
      } catch (error) {
        console.error('Failed to fetch ranking data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const currentUserRank = users.findIndex((u) => u.id === currentUser?.id) + 1

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Ranking Semanal</h1>
        <p className="text-muted-foreground mt-2">
          Veja sua posição e a dos melhores estudantes!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="md:hidden space-y-2">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-6 w-6" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    ))
                  : users.slice(0, 10).map((user, index) => (
                      <div
                        key={user.id}
                        className={cn(
                          'flex items-center justify-between p-2 rounded-md',
                          user.id === currentUser?.id && 'bg-primary/10',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg w-6 text-center">
                            {index + 1}
                          </span>
                          <Avatar>
                            <AvatarImage src={user.avatarUrl || ''} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <span className="font-semibold">
                          {user.score.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
              </div>
              <div className="relative w-full overflow-auto hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Posição</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead className="text-right">Pontuação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-6 w-12" />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-5 w-32" />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-5 w-16 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      : users.slice(0, 10).map((user, index) => (
                          <TableRow
                            key={user.id}
                            className={cn(
                              user.id === currentUser?.id && 'bg-primary/10',
                            )}
                          >
                            <TableCell className="font-bold text-lg flex items-center gap-2">
                              {index + 1 <= 3 && (
                                <Trophy
                                  className={cn(
                                    'h-5 w-5',
                                    index + 1 === 1 && 'text-yellow-500',
                                    index + 1 === 2 && 'text-gray-400',
                                    index + 1 === 3 && 'text-yellow-700',
                                  )}
                                />
                              )}
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatarUrl || ''} />
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {user.score.toLocaleString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Sua Posição</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-24 mx-auto bg-primary-foreground/20" />
                  <Skeleton className="h-6 w-32 mx-auto bg-primary-foreground/20" />
                </div>
              ) : (
                <>
                  <p className="text-6xl font-bold">
                    {currentUserRank > 0 ? `${currentUserRank}º` : '-'}
                  </p>
                  <p className="mt-2">
                    {currentUser?.score.toLocaleString('pt-BR')} pontos
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Como Pontuar?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Completar um vídeo:</strong> +50 pontos
                </li>
                <li>
                  <strong>Acertar questão de quiz:</strong> +100 pontos
                </li>
                <li>
                  <strong>Completar um quiz:</strong> +250 pontos
                </li>
                <li>
                  <strong>Participar de desafios:</strong> +500 pontos
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
