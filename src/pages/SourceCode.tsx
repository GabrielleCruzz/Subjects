import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Github } from 'lucide-react'

export default function SourceCode() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Github className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Nosso Código é Aberto!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Acreditamos no poder da colaboração e do aprendizado compartilhado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            O Subjescts é um projeto de código aberto. Isso significa que
            qualquer pessoa pode visualizar, analisar e contribuir com o nosso
            código-fonte. Queremos criar uma comunidade transparente e
            colaborativa, onde todos possam aprender e ajudar a construir uma
            plataforma de educação cada vez melhor.
          </p>
          <p>
            Explore nosso repositório no GitHub para entender como a plataforma
            funciona, sugerir melhorias ou até mesmo corrigir um bug. Sua
            contribuição é muito bem-vinda!
          </p>
          <Button size="lg" asChild>
            <a
              href="https://github.com/example/subjescts"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-5 w-5" />
              Acessar Repositório no GitHub
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
