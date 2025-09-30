import { BrainCircuit, Trophy, BarChart, Handshake } from 'lucide-react'

const differentials = [
  {
    icon: BrainCircuit,
    title: 'Educação + Entretenimento',
    description:
      'Combinamos conteúdo rigoroso com uma experiência divertida e engajadora.',
  },
  {
    icon: Trophy,
    title: 'Ambiente Motivador',
    description:
      'Gamificação e recompensas que incentivam o aprendizado contínuo.',
  },
  {
    icon: BarChart,
    title: 'Aprendizado Baseado em Dados',
    description:
      'Acompanhe seu progresso com métricas claras e insights valiosos.',
  },
  {
    icon: Handshake,
    title: 'Comunidade Colaborativa',
    description:
      'Um espaço seguro para aprender, ensinar e crescer junto com outros estudantes.',
  },
]

export const DifferentialsSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-background/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            O Que Nos Torna Únicos?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
            Descubra os pilares que fazem da Subjects uma plataforma de
            aprendizado diferenciada.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="mb-4">
                <item.icon className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
