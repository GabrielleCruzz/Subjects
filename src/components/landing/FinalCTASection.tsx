import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export const FinalCTASection = () => {
  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Pronto para Transformar Seu Aprendizado?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Cadastre-se na Subjects e comece sua jornada de aprendizado
            divertida e eficiente. Junte-se a uma comunidade que celebra cada
            conquista sua!
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/register">Começar Agora!</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
