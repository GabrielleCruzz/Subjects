import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Award, BookOpen, Video, BrainCircuit, Star } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const achievements = [
  {
    icon: BookOpen,
    title: 'Primeiros Passos',
    description: 'Completou seu primeiro quiz.',
    unlocked: true,
  },
  {
    icon: Video,
    title: 'Cinéfilo',
    description: 'Assistiu 10 vídeos.',
    unlocked: true,
  },
  {
    icon: Award,
    title: 'Mestre dos Quizzes',
    description: 'Acertou 100% em um quiz difícil.',
    unlocked: false,
  },
  {
    icon: BrainCircuit,
    title: 'Polímata',
    description: 'Completou um quiz em 5 matérias diferentes.',
    unlocked: true,
  },
  {
    icon: Star,
    title: 'Maratonista',
    description: 'Estudou por 7 dias seguidos.',
    unlocked: false,
  },
]

export const AchievementsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conquistas e Badges</CardTitle>
        <CardDescription>
          Suas medalhas de honra na jornada do conhecimento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {achievements.map((ach, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg aspect-square transition-all ${
                      ach.unlocked
                        ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300'
                        : 'bg-muted/50 border-dashed grayscale opacity-60'
                    }`}
                  >
                    <ach.icon
                      className={`h-12 w-12 ${
                        ach.unlocked
                          ? 'text-amber-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{ach.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {ach.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
