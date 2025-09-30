import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Quiz as QuizType, Difficulty } from '@/types'
import { getQuizById } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'

const pointsPerDifficulty: Record<Difficulty, number> = {
  Fácil: 100,
  Médio: 200,
  Difícil: 350,
  Impossível: 500,
}

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>()
  const [quiz, setQuiz] = useState<QuizType | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return
      setLoading(true)
      try {
        const currentQuiz = await getQuizById(quizId)
        setQuiz(currentQuiz || null)
      } catch (error) {
        console.error('Failed to fetch quiz:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return <div>Quiz não encontrado.</div>
  }

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return
    setSelectedAnswer(option)
    const correct = option === quiz.questions[currentQuestion].answer
    setIsCorrect(correct)
    if (correct) {
      setScore(score + pointsPerDifficulty[quiz.difficulty])
      setCorrectAnswers(correctAnswers + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background/50 p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Award className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl">Quiz Concluído!</CardTitle>
            <CardDescription>Parabéns! Você completou o quiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Você acertou {correctAnswers} de {quiz.questions.length} questões.
            </p>
            <p className="text-5xl font-bold text-primary my-2">
              +{score.toLocaleString('pt-BR')}
            </p>
            <p className="text-muted-foreground">pontos ganhos!</p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button className="w-full" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/quizzes">Ver outros Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="flex items-center justify-center min-h-screen bg-background/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle>Quiz: {quiz.title}</CardTitle>
          <CardDescription>
            Questão {currentQuestion + 1} de {quiz.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold mb-6">{question.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option
              const isAnswerCorrect =
                isCorrect !== null && option === question.answer
              return (
                <Button
                  key={option}
                  variant="outline"
                  size="lg"
                  className={cn(
                    'justify-start h-auto py-3 text-left',
                    isSelected &&
                      isCorrect === false &&
                      'bg-destructive/20 border-destructive',
                    isAnswerCorrect && 'bg-success/20 border-success',
                  )}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </Button>
              )
            })}
          </div>
          {isCorrect !== null && (
            <div
              className={cn(
                'mt-4 flex items-center gap-2 p-3 rounded-md',
                isCorrect
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive',
              )}
            >
              {isCorrect ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <p className="font-semibold">
                {isCorrect
                  ? `Resposta Correta! +${pointsPerDifficulty[quiz.difficulty]} pontos`
                  : `Incorreto. A resposta é: ${question.answer}`}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="w-full"
          >
            {currentQuestion < quiz.questions.length - 1
              ? 'Próxima Questão'
              : 'Finalizar Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
