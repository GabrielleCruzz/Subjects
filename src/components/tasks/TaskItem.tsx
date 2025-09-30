import { Task } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Clock } from 'lucide-react'
import { format, isPast, differenceInHours, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TaskItemProps {
  task: Task & { dueDate: Date | null }
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

export const TaskItem = ({ task, onToggleStatus, onDelete }: TaskItemProps) => {
  const now = new Date()
  const isOverdue = task.dueDate
    ? isPast(task.dueDate) && !isToday(task.dueDate)
    : false
  const isUrgent = task.dueDate
    ? (differenceInHours(task.dueDate, now) <= 24 && !isOverdue) ||
      isToday(task.dueDate)
    : false

  const getStatusBadge = () => {
    if (task.status === 'completed') {
      return (
        <Badge variant="default" className="bg-success hover:bg-success/90">
          Concluída
        </Badge>
      )
    }
    if (isOverdue) {
      return <Badge variant="destructive">Atrasada</Badge>
    }
    if (isUrgent) {
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          Urgente
        </Badge>
      )
    }
    return null
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.status === 'completed'}
            onCheckedChange={() => onToggleStatus(task.id)}
            className="h-6 w-6"
          />
          <div className="grid gap-1.5 flex-1 min-w-0">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate',
                task.status === 'completed' &&
                  'line-through text-muted-foreground',
              )}
            >
              {task.title}
            </label>
            {task.dueDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1.5 h-4 w-4" />
                <span>
                  {format(task.dueDate, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {getStatusBadge()}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="text-muted-foreground hover:text-destructive shrink-0"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
