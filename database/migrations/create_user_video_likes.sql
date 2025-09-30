-- Create table for tracking user video likes
CREATE TABLE IF NOT EXISTS user_video_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id) -- Ensure one like per user per video
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_video_likes_user_id ON user_video_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_video_likes_video_id ON user_video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_user_video_likes_created_at ON user_video_likes(created_at);

-- Enable Row Level Security
ALTER TABLE user_video_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view all likes" ON user_video_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON user_video_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON user_video_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for videos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for videos bucket
CREATE POLICY "Anyone can view videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);