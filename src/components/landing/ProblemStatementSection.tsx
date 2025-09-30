import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: 'Não encontram conteúdo de qualidade', value: 56 },
  { name: 'Encontram conteúdo de qualidade', value: 44 },
]

const COLORS = ['hsl(var(--primary))', 'hsl(var(--border))']

export const ProblemStatementSection = () => {
  return (
    <section id="problem" className="py-16 lg:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              O Desafio da Qualidade Online
            </h2>
            <p className="text-lg text-muted-foreground">
              Um estudo revelou que 56% dos alunos não encontram conteúdo de
              qualidade na internet. A maioria dos recursos online é
              superficial, desatualizada ou pouco confiável, prejudicando o
              aprendizado e a formação crítica dos estudantes.
            </p>
          </div>
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-md">
              <CardHeader>
                <CardTitle className="text-center">
                  Qualidade do Conteúdo Online
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="hsl(var(--background))"
                        strokeWidth={4}
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Não encontram (56%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-border"></div>
                    <span>Encontram (44%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
