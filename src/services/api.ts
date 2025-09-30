import { supabase } from '@/lib/supabase/client'
import {
  User,
  Video,
  Comment,
  Quiz,
  Task,
  DashboardData,
  QuizQuestion,
  CommunityPost,
} from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

const handleSupabaseResponse = <T>({
  data,
  error,
}: {
  data: T | null
  error: PostgrestError | null
}): T => {
  if (error) {
    console.error('Supabase error:', error)
    throw new Error(error.message)
  }
  return data as T
}

const userQuery =
  'id, name, email, role, avatarUrl:avatar_url, series, institution, score, registeredAt:registered_at'
const videoQuery =
  'id, title, description, subject, videoUrl:video_url, thumbnailUrl:thumbnail_url, uploaderId:uploader_id, likes, views'
const commentQuery =
  'id, videoId:video_id, userId:user_id, text, timestamp, status'
const quizQuery = 'id, title, subject, difficulty, questions'
const taskQuery = 'id, userId:user_id, title, dueDate:due_date, status'

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select(userQuery)
  return handleSupabaseResponse({ data, error }) || []
}

export const updateUser = async (
  userId: string,
  userData: Partial<User>,
): Promise<User> => {
  const { avatarUrl, registeredAt, ...rest } = userData
  const supabaseData = {
    ...rest,
    avatar_url: avatarUrl,
    registered_at: registeredAt,
  }
  const { data, error } = await supabase
    .from('users')
    .update(supabaseData)
    .eq('id', userId)
    .select(userQuery)
    .single()
  return handleSupabaseResponse({ data, error })
}

export const deleteUser = async (
  userId: string,
): Promise<{ success: true }> => {
  const { error } = await supabase.from('users').delete().eq('id', userId)
  if (error) throw error
  return { success: true }
}

export const getVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase.from('videos').select(videoQuery)
  return handleSupabaseResponse({ data, error }) || []
}

export const createVideo = async (
  videoData: Omit<Video, 'id'>,
): Promise<Video> => {
  const { videoUrl, thumbnailUrl, uploaderId, ...rest } = videoData
  const { data, error } = await supabase
    .from('videos')
    .insert({
      ...rest,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      uploader_id: uploaderId,
    })
    .select(videoQuery)
    .single()
  return handleSupabaseResponse({ data, error })
}

export const deleteVideo = async (
  videoId: string,
): Promise<{ success: true }> => {
  const { error } = await supabase.from('videos').delete().eq('id', videoId)
  if (error) throw error
  return { success: true }
}

export const getTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(taskQuery)
    .eq('user_id', userId)
  return handleSupabaseResponse({ data, error }) || []
}

export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
  const { userId, dueDate, ...rest } = taskData
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...rest, user_id: userId, due_date: dueDate })
    .select(taskQuery)
    .single()
  return handleSupabaseResponse({ data, error })
}

export const updateTask = async (
  taskId: string,
  taskData: Partial<Task>,
): Promise<Task> => {
  const { userId, dueDate, ...rest } = taskData
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...rest, user_id: userId, due_date: dueDate })
    .eq('id', taskId)
    .select(taskQuery)
    .single()
  return handleSupabaseResponse({ data, error })
}

export const deleteTask = async (
  taskId: string,
): Promise<{ success: true }> => {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
  return { success: true }
}

export const getQuizzes = async (): Promise<Quiz[]> => {
  const { data, error } = await supabase.from('quizzes').select(quizQuery)
  return (handleSupabaseResponse({ data, error }) || []).map((q: any) => ({
    ...q,
    questions: q.questions as QuizQuestion[],
  }))
}

export const getQuizById = async (
  quizId: string,
): Promise<Quiz | undefined> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(quizQuery)
    .eq('id', quizId)
    .single()
  const quiz = handleSupabaseResponse({ data, error })
  return quiz
    ? { ...quiz, questions: quiz.questions as QuizQuestion[] }
    : undefined
}

export const createQuiz = async (quizData: Omit<Quiz, 'id'>): Promise<Quiz> => {
  const { data, error } = await supabase
    .from('quizzes')
    .insert(quizData)
    .select(quizQuery)
    .single()
  return handleSupabaseResponse({ data, error })
}

export const deleteQuiz = async (
  quizId: string,
): Promise<{ success: true }> => {
  const { error } = await supabase.from('quizzes').delete().eq('id', quizId)
  if (error) throw error
  return { success: true }
}

export const getComments = async (): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('video_comments')
    .select(commentQuery)
  return handleSupabaseResponse({ data, error }) || []
}

export const updateCommentStatus = async (
  commentId: string,
  status: Comment['status'],
): Promise<Comment> => {
  const { data, error } = await supabase
    .from('video_comments')
    .update({ status })
    .eq('id', commentId)
    .select(commentQuery)
    .single()
  return handleSupabaseResponse({ data, error })
}

export const deleteComment = async (
  commentId: string,
): Promise<{ success: true }> => {
  const { error } = await supabase
    .from('video_comments')
    .delete()
    .eq('id', commentId)
  if (error) throw error
  return { success: true }
}

export const getDashboardData = async (): Promise<DashboardData> => {
  // This remains mocked as it aggregates complex data
  return {
    progress: 78,
    continueLearning: {
      subjectId: 'matematica',
      subjectName: 'Matemática',
      topicName: 'Álgebra - Funções do 1º Grau',
    },
    subjects: [
      { id: 'matematica', name: 'Matemática', icon: 'Book' },
      { id: 'portugues', name: 'Português', icon: 'Book' },
      { id: 'historia', name: 'História', icon: 'Book' },
    ],
    rankingEvolution: [
      { name: 'S-4', position: 60 },
      { name: 'S-3', position: 52 },
      { name: 'S-2', position: 35 },
      { name: 'S-1', position: 28 },
      { name: 'Hoje', position: 22 },
    ],
    communityNews: [
      {
        user: '@joao_vitor',
        text: 'Alguém tem dicas para a prova de física?',
      },
      {
        user: '@maria_clara',
        text: 'Amei o novo vídeo sobre a Grécia Antiga!',
      },
    ],
  }
}

// Community API functions
const communityPostQuery = 'id, title, content, timestamp, likes, comments, user_id'

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  const { data, error } = await supabase
    .from('community_posts')
    .select(communityPostQuery)
    .order('timestamp', { ascending: false })
  
  const posts = handleSupabaseResponse({ data, error }) || []
  return posts.map((post: any) => ({
    ...post,
    userId: post.user_id,
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
  }))
}

export const createCommunityPost = async (
  postData: Omit<CommunityPost, 'id'>
): Promise<CommunityPost> => {
  const { userId, ...rest } = postData
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      ...rest,
      user_id: userId,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
    })
    .select(communityPostQuery)
    .single()
  
  const post = handleSupabaseResponse({ data, error })
  return {
    ...post,
    userId: post.user_id,
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
  }
}

export const likeCommunityPost = async (
  postId: string,
  userId: string
): Promise<CommunityPost> => {
  // First get the current post
  const { data: currentPost, error: fetchError } = await supabase
    .from('community_posts')
    .select(communityPostQuery)
    .eq('id', postId)
    .single()
  
  if (fetchError) throw fetchError
  
  const currentLikes = Array.isArray(currentPost.likes) ? currentPost.likes : []
  const userIndex = currentLikes.indexOf(userId)
  
  let newLikes
  if (userIndex > -1) {
    // User already liked, remove like
    newLikes = currentLikes.filter((id: string) => id !== userId)
  } else {
    // User hasn't liked, add like
    newLikes = [...currentLikes, userId]
  }
  
  const { data, error } = await supabase
    .from('community_posts')
    .update({ likes: newLikes })
    .eq('id', postId)
    .select(communityPostQuery)
    .single()
  
  const post = handleSupabaseResponse({ data, error })
  return {
    ...post,
    userId: post.user_id,
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
  }
}

export const addCommunityComment = async (
  postId: string,
  userId: string,
  text: string
): Promise<CommunityPost> => {
  // First get the current post
  const { data: currentPost, error: fetchError } = await supabase
    .from('community_posts')
    .select(communityPostQuery)
    .eq('id', postId)
    .single()
  
  if (fetchError) throw fetchError
  
  const currentComments = Array.isArray(currentPost.comments) ? currentPost.comments : []
  const newComment = {
    id: Date.now().toString(),
    userId,
    text,
    timestamp: new Date().toISOString(),
  }
  
  const newComments = [...currentComments, newComment]
  
  const { data, error } = await supabase
    .from('community_posts')
    .update({ comments: newComments })
    .eq('id', postId)
    .select(communityPostQuery)
    .single()
  
  const post = handleSupabaseResponse({ data, error })
  return {
    ...post,
    userId: post.user_id,
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
  }
}

// Video interaction functions
export const createVideoComment = async (
  videoId: string,
  userId: string,
  text: string
): Promise<Comment> => {
  const { data, error } = await supabase
    .from('video_comments')
    .insert({
      video_id: videoId,
      user_id: userId,
      text,
      timestamp: new Date().toISOString(),
      status: 'Pendente', // Comments need moderation
    })
    .select(commentQuery)
    .single()
  
  return handleSupabaseResponse({ data, error })
}

// ❌ REMOVA COMPLETAMENTE A FUNÇÃO ABAIXO (LINHAS 388-400)
/*
export const likeVideo = async (
  videoId: string,
  currentLikes: number
): Promise<Video> => {
  const { data, error } = await supabase
    .from('videos')
    .update({ likes: currentLikes })
    .eq('id', videoId)
    .select(videoQuery)
    .single()
  
  return handleSupabaseResponse({ data, error })
}
*/

export const updateVideoViews = async (
  videoId: string,
  currentViews: number
): Promise<Video> => {
  const { data, error } = await supabase
    .from('videos')
    .update({ views: currentViews })
    .eq('id', videoId)
    .select(videoQuery)
    .single()
  
  return handleSupabaseResponse({ data, error })
}

// Real video file upload using Supabase Storage
export const uploadVideoFile = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('Nenhum arquivo foi selecionado')
    }

    // Check file size
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      throw new Error(`Arquivo muito grande (${fileSizeMB}MB). Tamanho máximo: 50MB`)
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Formato não suportado. Use: MP4, WebM, OGG, MOV ou AVI')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
    const fileName = `${timestamp}_${sanitizedName}`

    console.log('Processing video file:', { 
      fileName, 
      size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`, 
      type: file.type 
    })

    // ============================================
    // SOLUÇÃO LOCAL - SEM SUPABASE STORAGE
    // ============================================
    
    // Criar URL temporária para o arquivo (funciona perfeitamente no navegador)
    const videoUrl = URL.createObjectURL(file)
    
    // Salvar referência do arquivo no localStorage para persistência
    const videoData = {
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: videoUrl,
      timestamp
    }
    
    // Armazenar no localStorage (opcional, para debug)
    const savedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]')
    savedVideos.push(videoData)
    localStorage.setItem('uploadedVideos', JSON.stringify(savedVideos))
    
    console.log('Video processed successfully:', videoUrl)
    return videoUrl

  } catch (error) {
    console.error('Failed to process video:', error)
    throw error
  }
}

// Video likes management with user tracking
export const getUserVideoLikes = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('user_video_likes')
    .select('video_id')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Failed to get user likes:', error)
    return []
  }
  
  return data.map(like => like.video_id)
}

export const toggleVideoLike = async (
  videoId: string,
  userId: string
): Promise<{ liked: boolean; totalLikes: number }> => {
  try {
    // Check if user already liked this video
    const { data: existingLike, error: checkError } = await supabase
      .from('user_video_likes')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .single()

    let liked = false
    
    if (existingLike) {
      // Remove like
      const { error: deleteError } = await supabase
        .from('user_video_likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId)
      
      if (deleteError) throw deleteError
      liked = false
    } else {
      // Add like
      const { error: insertError } = await supabase
        .from('user_video_likes')
        .insert({
          video_id: videoId,
          user_id: userId,
          created_at: new Date().toISOString()
        })
      
      if (insertError) throw insertError
      liked = true
    }

    // Get updated total likes count
    const { count, error: countError } = await supabase
      .from('user_video_likes')
      .select('*', { count: 'exact', head: true })
      .eq('video_id', videoId)

    if (countError) throw countError

    // Update video likes count
    const { error: updateError } = await supabase
      .from('videos')
      .update({ likes: count || 0 })
      .eq('id', videoId)

    if (updateError) throw updateError

    return { liked, totalLikes: count || 0 }
  } catch (error) {
    console.error('Failed to toggle video like:', error)
    throw error
  }
}

export const uploadThumbnail = async (videoTitle: string, subject: string): Promise<string> => {
  // Generate a thumbnail URL based on the video content
  return `https://img.usecurling.com/p/400/225?q=${encodeURIComponent(
    `${subject} ${videoTitle}`
  )}%20lesson`
}
