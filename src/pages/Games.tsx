import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gamepad2 } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

const games = [
  {
    title: 'Jogo da Forca',
    description: 'Teste seu vocabulário e adivinhe a palavra secreta.',
    link: '/games/hangman',
    image: 'https://img.usecurling.com/p/400/225?q=hangman%20game%20chalkboard',
  },
]

export default function Games() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Central de Jogos</h1>
        <p className="text-muted-foreground mt-2">
          Aprenda e divirta-se com nossos jogos educacionais.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.title}
            className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col"
          >
            <CardHeader className="p-0">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={game.image}
                  alt={game.title}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle>{game.title}</CardTitle>
              <CardDescription className="mt-2 text-sm">
                {game.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link to={game.link}>
                  <Gamepad2 className="mr-2 h-4 w-4" /> Jogar Agora
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
