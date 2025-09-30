-- ============================================
-- SCRIPT COMPLETO PARA CONFIGURAR STORAGE DE VÍDEOS
-- Execute este script inteiro no SQL Editor do Supabase
-- ============================================

-- 1. Criar bucket de vídeos (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('videos', 'videos', true, 52428800, ARRAY['video/mp4','video/webm','video/ogg','video/quicktime','video/x-msvideo'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4','video/webm','video/ogg','video/quicktime','video/x-msvideo'];

-- 2. Habilitar RLS na tabela storage.objects (se não estiver habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;

-- 4. Criar políticas corretas
CREATE POLICY "videos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "videos_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "videos_auth_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "videos_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- 5. Criar tabela user_video_likes (se não existir)
CREATE TABLE IF NOT EXISTS user_video_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- 6. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_video_likes_user_id ON user_video_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_video_likes_video_id ON user_video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_user_video_likes_created_at ON user_video_likes(created_at);

-- 7. Habilitar RLS na tabela user_video_likes
ALTER TABLE user_video_likes ENABLE ROW LEVEL SECURITY;

-- 8. Criar políticas para user_video_likes
DROP POLICY IF EXISTS "Users can view all likes" ON user_video_likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON user_video_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON user_video_likes;

CREATE POLICY "Users can view all likes" ON user_video_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON user_video_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON user_video_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SCRIPT CONCLUÍDO! 
-- Agora teste o upload de vídeo na sua aplicação
-- ============================================