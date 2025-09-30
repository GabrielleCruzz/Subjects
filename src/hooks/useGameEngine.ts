import { useState, useEffect, useCallback } from 'react'
import { getRandomQuestion, Question } from '@/data/questions'
import { Player } from '@/components/games/PlayerProfile'

type GameState = 'lobby' | 'playing' | 'gameover'

const INITIAL_LIVES = 3
const TURN_DURATION = 10

export const useGameEngine = (initialPlayers: Player[]) => {
  const [gameState, setGameState] = useState<GameState>('lobby')
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] =
    useState<Question>(getRandomQuestion())
  const [timer, setTimer] = useState(TURN_DURATION)
  const [isExploding, setIsExploding] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const activePlayers = players.filter((p) => p.lives > 0)
  const winner = activePlayers.length === 1 ? activePlayers[0] : null

  const nextTurn = useCallback(() => {
    if (winner) {
      setGameState('gameover')
      return
    }

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
    const nextActivePlayer = players
      .slice(nextPlayerIndex)
      .concat(players.slice(0, nextPlayerIndex))
      .find((p) => p.lives > 0)

    if (nextActivePlayer) {
      setCurrentPlayerIndex(
        players.findIndex((p) => p.id === nextActivePlayer.id),
      )
      setCurrentQuestion(getRandomQuestion())
      setTimer(TURN_DURATION)
      setFeedback(null)
      setIsExploding(false)
    } else {
      setGameState('gameover')
    }
  }, [players, currentPlayerIndex, winner])

  useEffect(() => {
    if (gameState !== 'playing') return

    if (timer > 0 && feedback === null) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }

    if (timer === 0 && feedback === null) {
      setIsExploding(true)
      setPlayers((prev) =>
        prev.map((p, i) =>
          i === currentPlayerIndex ? { ...p, lives: p.lives - 1 } : p,
        ),
      )
      setTimeout(nextTurn, 1500) // Explosion animation time
    }
  }, [gameState, timer, feedback, currentPlayerIndex, nextTurn])

  const startGame = () => {
    setPlayers(
      initialPlayers.map((p) => ({ ...p, lives: INITIAL_LIVES, score: 0 })),
    )
    setCurrentPlayerIndex(0)
    setGameState('playing')
    setTimer(TURN_DURATION)
    setIsExploding(false)
    setFeedback(null)
  }

  const submitAnswer = (answer: string) => {
    if (feedback) return
    const isCorrect =
      answer.toLowerCase() === currentQuestion.answer.toLowerCase()
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    setPlayers((prev) =>
      prev.map((p, i) => {
        if (i === currentPlayerIndex) {
          return {
            ...p,
            score: isCorrect ? p.score + 100 : Math.max(0, p.score - 10),
          }
        }
        return p
      }),
    )
    setTimeout(nextTurn, 1500) // Feedback display time
  }

  return {
    gameState,
    players,
    currentPlayerIndex,
    currentQuestion,
    timer,
    isExploding,
    feedback,
    winner,
    startGame,
    submitAnswer,
  }
}
