import { Database } from '@/lib/supabase/types'

export type UserRole = Database['public']['Enums']['user_role']
export type Difficulty = Database['public']['Enums']['quiz_difficulty']

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string | null
  series?: string | null
  institution?: string | null
  score: number
  rank?: number
  registeredAt: string | null
}

export interface Video {
  id: string
  title: string
  description: string
  subject: string
  videoUrl: string
  thumbnailUrl: string
  uploaderId: string | null
  likes: number
  views: number
}

export interface Comment {
  id: string
  videoId: string | null
  userId: string | null
  text: string
  timestamp: string | null
  status: Database['public']['Enums']['comment_moderation_status']
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: string
}

export interface Quiz {
  id: string
  title: string
  subject: string
  difficulty: Difficulty
  questions: QuizQuestion[]
}

export interface Task {
  id: string
  userId: string | null
  title: string
  dueDate: string | null
  status: Database['public']['Enums']['task_status']
}

export interface CommunityPost {
  id: string
  userId: string | null
  title: string
  content: string
  timestamp: string | null
  likes: string[]
  comments: CommunityComment[]
}

export interface CommunityComment {
  id: string
  userId: string | null
  text: string
  timestamp: string | null
}

export interface Subject {
  id: string
  name: string
  icon: string
}

export interface ContinueLearning {
  subjectId: string
  subjectName: string
  topicName: string
}

export interface RankingDataPoint {
  name: string
  position: number
}

export interface DashboardData {
  progress: number
  continueLearning: ContinueLearning
  subjects: Subject[]
  rankingEvolution: RankingDataPoint[]
  communityNews: { user: string; text: string }[]
}

export interface LoginCredentials {
  email: string
  password?: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
  role: 'student' | 'teacher'
}
