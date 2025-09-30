import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  BarChart2,
  History,
  Award,
  Video,
  MessageSquare,
} from 'lucide-react'
import { PerformanceSection } from '@/components/profile/PerformanceSection'
import { HistorySection } from '@/components/profile/HistorySection'
import { SecuritySettings } from '@/components/profile/SecuritySettings'
import { ProfileSettings } from '@/components/profile/ProfileSettings'
import { AchievementsSection } from '@/components/profile/AchievementsSection'
import { MyVideosSection } from '@/components/profile/MyVideosSection'
import { CommentModerationSection } from '@/components/profile/CommentModerationSection'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações, acompanhe seu progresso e muito mais.
        </p>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="performance">
            <BarChart2 className="mr-2 h-4 w-4" /> Desempenho
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" /> Histórico
          </TabsTrigger>
          {user.role === 'student' && (
            <TabsTrigger value="achievements">
              <Award className="mr-2 h-4 w-4" /> Conquistas
            </TabsTrigger>
          )}
          {user.role === 'teacher' && (
            <>
              <TabsTrigger value="my-videos">
                <Video className="mr-2 h-4 w-4" /> Meus Vídeos
              </TabsTrigger>
              <TabsTrigger value="moderation">
                <MessageSquare className="mr-2 h-4 w-4" /> Moderação
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" /> Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <PerformanceSection />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <HistorySection />
        </TabsContent>
        {user.role === 'student' && (
          <TabsContent value="achievements" className="mt-6">
            <AchievementsSection />
          </TabsContent>
        )}
        {user.role === 'teacher' && (
          <>
            <TabsContent value="my-videos" className="mt-6">
              <MyVideosSection />
            </TabsContent>
            <TabsContent value="moderation" className="mt-6">
              <CommentModerationSection />
            </TabsContent>
          </>
        )}
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <ProfileSettings />
            <SecuritySettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
