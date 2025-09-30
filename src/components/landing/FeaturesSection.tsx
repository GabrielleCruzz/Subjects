import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PlayCircle,
  HelpCircle,
  BarChart3,
  MessageSquare,
  BookCheck,
  TrendingUp,
} from 'lucide-react'

const features = [
  {
    icon: PlayCircle,
    title: 'Vídeos Educativos',
    description:
      'Vídeos com linguagem jovem e acessível, que explicam conceitos complexos de forma clara e divertida.',
  },
  {
    icon: HelpCircle,
    title: 'Quizzes e Desafios',
    description:
      'Testes interativos e desafios gamificados para fixar o conteúdo e medir seu conhecimento.',
  },
  {
    icon: BarChart3,
    title: 'Ranking Semanal',
    description:
      'Compita de forma saudável com outros estudantes e veja seu progresso no ranking.',
  },
  {
    icon: MessageSquare,
    title: 'Comunidade Interativa',
    description:
      'Conecte-se, tire dúvidas e colabore com uma comunidade vibrante de estudantes.',
  },
  {
    icon: BookCheck,
    title: 'Conteúdo Pedagógico',
    description:
      'Materiais desenvolvidos com base pedagógica confiável e atualizada.',
  },
  {
    icon: TrendingUp,
    title: 'Monitoramento de Progresso',
    description:
      'Acompanhe suas conquistas e celebre cada etapa da sua jornada de aprendizado.',
  },
]

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Recursos que Transformam o Aprendizado
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
            Explore as ferramentas que tornam o Subjescts a plataforma ideal
            para seus estudos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center transition-all duration-300 ease-out hover:transform hover:-translate-y-2 hover:scale-102 hover:shadow-md"
            >
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
