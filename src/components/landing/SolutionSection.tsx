import { Video, Puzzle, Trophy, Users } from 'lucide-react'

const solutionItems = [
  { icon: Video, text: 'Vídeos de alta qualidade' },
  { icon: Puzzle, text: 'Quizzes interativos' },
  { icon: Trophy, text: 'Rankings semanais' },
  { icon: Users, text: 'Comunidade engajada' },
]

export const SolutionSection = () => {
  return (
    <section id="solution" className="py-16 lg:py-24 bg-background/50">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          A Solução Subjects
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12">
          Subjects oferece uma plataforma gamificada e confiável, com conteúdos
          educativos de alta qualidade, atualizados regularmente, com curadoria
          pedagógica. Os usuários têm acesso a vídeos, quizzes, materiais
          interativos e rankings semanais que estimulam o progresso e a
          motivação contínua.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {solutionItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <item.icon className="h-10 w-10 text-primary" />
              </div>
              <span className="font-semibold text-center">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
