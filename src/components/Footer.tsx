import { Instagram, Youtube, Twitch, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const Logo = () => (
  <Link
    to="/"
    className="flex items-center gap-2 text-xl font-bold text-primary"
  >
    Subjects
  </Link>
)

export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Logo />
            <p className="text-muted-foreground text-sm mt-2">
              Subjects © 2025. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              to="/source-code"
              className="hover:text-primary transition-colors"
            >
             
            </Link>
          </div>
          <div className="flex items-center gap-4">
        
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-transform hover:scale-110"
            >
              <Instagram className="h-6 w-6" />
            </a>
           
            
          </div>
        </div>
      </div>
    </footer>
  )
}
