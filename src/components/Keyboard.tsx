import { Button } from '@/components/ui/button'

const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

type KeyboardProps = {
  activeLetters: string[]
  inactiveLetters: string[]
  addGuessedLetter: (letter: string) => void
  disabled?: boolean
}

export const Keyboard = ({
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
  disabled = false,
}: KeyboardProps) => {
  return (
    <div className="grid grid-cols-7 md:grid-cols-9 gap-2 self-stretch">
      {KEYS.map((key) => {
        const isActive = activeLetters.includes(key)
        const isInactive = inactiveLetters.includes(key)
        return (
          <Button
            onClick={() => addGuessedLetter(key)}
            variant={
              isActive ? 'success' : isInactive ? 'destructive' : 'outline'
            }
            size="lg"
            key={key}
            disabled={isActive || isInactive || disabled}
          >
            {key}
          </Button>
        )
      })}
    </div>
  )
}
