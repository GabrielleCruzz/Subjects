import { GraduationCap, Lightbulb, Users, SearchCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const audiences = [
  {
    icon: GraduationCap,
    title: 'Estudantes',
    description:
      'Do ensino fundamental e médio que querem aprender de forma mais eficaz e divertida.',
  },
  {
    icon: Lightbulb,
    title: 'Jovens Curiosos',
    description:
      'Que buscam métodos alternativos e inovadores de aprendizagem.',
  },
  {
    icon: Users,
    title: 'Pais e Educadores',
    description:
      'Interessados em conteúdos confiáveis e uma ferramenta de apoio aos estudos.',
  },
  {
    icon: SearchCheck,
    title: 'Estudantes Exigentes',
    description:
      'Insatisfeitos com a qualidade do conteúdo superficial encontrado online.',
  },
]

export const TargetAudienceSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Para Quem é a Subjects?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
            Nossa plataforma foi desenhada para atender às necessidades de
            diversos públicos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <Card key={index} className="text-left">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <audience.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">{audience.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{audience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
