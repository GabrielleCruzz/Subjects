import { useState, useEffect, useCallback } from 'react'
import { getRandomWord } from '@/data/words'
import { HangmanDrawing } from '@/components/HangmanDrawing'
import { HangmanWord } from '@/components/HangmanWord'
import { Keyboard } from '@/components/Keyboard'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function Hangman() {
  const [wordToGuess, setWordToGuess] = useState(getRandomWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter),
  )

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess
    .split('')
    .every((letter) => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return
      setGuessedLetters((currentLetters) => [...currentLetters, letter])
    },
    [guessedLetters, isWinner, isLoser],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (!key.match(/^[A-Z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)
    }
    document.addEventListener('keypress', handler)
    return () => document.removeEventListener('keypress', handler)
  }, [addGuessedLetter])

  const playAgain = () => {
    setWordToGuess(getRandomWord())
    setGuessedLetters([])
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center p-4">
      <AlertDialog open={isWinner || isLoser}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isWinner ? 'Parabéns, você venceu!' : 'Que pena, você perdeu!'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              A palavra era: {wordToGuess}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={playAgain}>
              Jogar Novamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h1 className="text-3xl font-bold text-center">Jogo da Forca</h1>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <Keyboard
        disabled={isWinner || isLoser}
        activeLetters={guessedLetters.filter((letter) =>
          wordToGuess.includes(letter),
        )}
        inactiveLetters={incorrectLetters}
        addGuessedLetter={addGuessedLetter}
      />
    </div>
  )
}
