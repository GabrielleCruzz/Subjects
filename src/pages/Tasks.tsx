import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PlusCircle, ListTodo } from 'lucide-react'
import { Task } from '@/types'
import { TaskForm, TaskFormValues } from '@/components/tasks/TaskForm'
import { TaskItem } from '@/components/tasks/TaskItem'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { getTasks, createTask, updateTask, deleteTask } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) return
    setLoading(true)
    try {
      const userTasks = await getTasks(user.id)
      setTasks(userTasks)
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar tarefas' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  const handleAddTask = async (values: TaskFormValues) => {
    if (!user) return
    setIsSubmitting(true)
    try {
      await createTask({
        userId: user.id,
        title: values.title,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        status: 'pending',
      })
      toast({
        title: 'Tarefa Adicionada!',
        description: 'Sua nova tarefa foi criada com sucesso.',
      })
      fetchTasks()
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao adicionar tarefa' })
    } finally {
      setIsSubmitting(false)
      setIsFormOpen(false)
    }
  }

  const handleToggleStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    try {
      await updateTask(id, { status: newStatus })
      fetchTasks()
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao atualizar tarefa' })
    }
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return
    try {
      await deleteTask(taskToDelete)
      toast({
        variant: 'destructive',
        title: 'Tarefa Excluída!',
        description: 'A tarefa foi removida da sua lista.',
      })
      fetchTasks()
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao excluir tarefa' })
    } finally {
      setTaskToDelete(null)
    }
  }

  const pendingTasks = tasks.filter((task) => task.status === 'pending')
  const completedTasks = tasks.filter((task) => task.status === 'completed')

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">Minhas Tarefas</h1>
          <p className="text-muted-foreground mt-2">
            Organize seus estudos e acompanhe suas atividades.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleAddTask} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pendentes</h2>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : pendingTasks.length > 0 ? (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={{
                    ...task,
                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                  }}
                  onToggleStatus={handleToggleStatus}
                  onDelete={setTaskToDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
              <ListTodo className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Nenhuma tarefa pendente. Bom trabalho!
              </p>
            </div>
          )}
        </div>

        {completedTasks.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="completed-tasks">
              <AccordionTrigger className="text-2xl font-semibold">
                Concluídas ({completedTasks.length})
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={{
                      ...task,
                      dueDate: task.dueDate ? new Date(task.dueDate) : null,
                    }}
                    onToggleStatus={handleToggleStatus}
                    onDelete={setTaskToDelete}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>

      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={() => setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir a tarefa
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask}>
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
