import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { RefreshCw, MoreHorizontal, RotateCcw } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { User } from '@/types'
import { getUsers, updateUser } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AdminRanking() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      const sortedUsers = data.sort((a, b) => b.score - a.score)
      setUsers(sortedUsers)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar ranking',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleResetAll = async () => {
    try {
      await Promise.all(users.map((user) => updateUser(user.id, { score: 0 })))
      toast({
        title: 'Sucesso!',
        description: 'As pontuações de todos os usuários foram resetadas.',
      })
      fetchUsers()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao resetar pontuações',
      })
    }
  }

  const handleResetOne = async (userId: string, userName: string) => {
    try {
      await updateUser(userId, { score: 0 })
      toast({
        title: 'Sucesso!',
        description: `A pontuação de ${userName} foi resetada.`,
      })
      fetchUsers()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao resetar pontuação',
      })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center sm:text-left">
          Gerenciamento de Ranking
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Resetar Pontuações
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso irá resetar as pontuações
                de todos os usuários para zero.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetAll}>
                Confirmar Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ranking Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="md:hidden space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </Card>
                ))
              : users.map((user, index) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg w-6 text-center">
                          {index + 1}
                        </span>
                        <Avatar>
                          <AvatarImage src={user.avatarUrl || ''} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.score.toLocaleString('pt-BR')} pontos
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleResetOne(user.id, user.name)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Resetar Pontuação
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
          </div>
          <div className="relative w-full overflow-auto hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="text-right">Pontuação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-5 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : users.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="text-right">
                          {user.score.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleResetOne(user.id, user.name)
                                }
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Resetar Pontuação
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
