import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[calc(100vh-80px)] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 animated-gradient -z-10"></div>
      <div className="absolute inset-0 bg-background/20 -z-10"></div>

      <div className="container px-4 md:px-6 text-center">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
              <span className="typewriter-text">
                Subjects: Aprenda, Jogue, Conquiste!
              </span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-foreground/80 mb-8 animate-fade-in-up [animation-delay:2.5s]">
              A plataforma inovadora que une aprendizado e entretenimento para
              jovens em busca de uma forma diferente de estudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up [animation-delay:3s]">
              <Button size="lg" asChild>
                <Link to="/register">Cadastre-se Grátis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Explorar Conteúdo</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <img
              src="https://img.usecurling.com/p/600/600?q=students%20learning%20digital%20tablet"
              alt="Estudantes interagindo com aprendizado digital"
              className="rounded-2xl shadow-lg animate-float"
            />
          </div>
        </div>
      </div>

      <a
        href="#problem"
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-8 w-8 text-foreground/80 animate-bounce" />
      </a>
    </section>
  )
}
