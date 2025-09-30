type HangmanWordProps = {
  guessedLetters: string[]
  wordToGuess: string
  reveal?: boolean
}

export const HangmanWord = ({
  guessedLetters,
  wordToGuess,
  reveal = false,
}: HangmanWordProps) => {
  return (
    <div className="flex gap-2 md:gap-4 text-4xl md:text-6xl font-bold uppercase font-mono">
      {wordToGuess.split('').map((letter, index) => (
        <span
          className="border-b-4 md:border-b-8 border-foreground"
          key={index}
        >
          <span
            className={
              guessedLetters.includes(letter) || reveal
                ? 'visible'
                : 'invisible'
            }
            style={{
              color:
                !guessedLetters.includes(letter) && reveal ? 'red' : 'inherit',
            }}
          >
            {letter}
          </span>
        </span>
      ))}
    </div>
  )
}
