import type { Database } from '~/types/database.types'

export const useMissionProgress = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // State
  const profile = useState('user-profile', () => null as any)
  const missions = useState('user-missions', () => [] as any[])
  const loading = useState('mission-loading', () => false)
  const errorMessage = useState('mission-error', () => '')

  const fetchProfileAndProgress = async () => {
    let currentUserId = user.value?.id
    if (!currentUserId) {
      const { data } = await supabase.auth.getUser()
      currentUserId = data.user?.id
    }

    if (!currentUserId) {
      errorMessage.value = "Gagal memuat sesi: User ID tidak ditemukan."
      return
    }

    loading.value = true
    errorMessage.value = ''
    
    // Fetch profile
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUserId)
      .single()
      
    if (profileErr) {
      console.error('Profile error:', profileErr)
      errorMessage.value += `Profile Err: ${profileErr.message}. `
    }
    if (profileData) profile.value = profileData

    // Fetch missions
    const { data: missionsData, error: missionsErr } = await supabase
      .from('mission_progress')
      .select('*')
      .eq('user_id', currentUserId)
      .order('mission_id', { ascending: true })

    if (missionsErr) {
      console.error('Missions error:', missionsErr)
      errorMessage.value += `Missions Err: ${missionsErr.message}. `
    }
    if (missionsData) missions.value = missionsData
    
    loading.value = false
  }

  const saveMissionResult = async (missionId: number, score: number, timeSpent: number) => {
    if (!profile.value?.id) {
      console.error('Cannot save mission result: Profile ID is missing')
      return
    }

    const currentUserId = profile.value.id

    // 1. Insert game session
    const { error: sessionErr } = await supabase.from('game_sessions').insert({
      user_id: currentUserId,
      mission_id: missionId,
      questions_total: 5,
      correct_answers: score,
      time_spent_seconds: timeSpent,
      ended_at: new Date().toISOString()
    })
    
    if (sessionErr) console.error('Failed to save game session:', sessionErr)

    // 2. Update mission progress
    const currentMission = missions.value.find(m => m.mission_id === missionId)
    
    let isCompleted = currentMission?.is_completed || score >= 3
    const newBestScore = Math.max(currentMission?.best_score || 0, score)
    const completedAt = (!currentMission?.is_completed && isCompleted) ? new Date().toISOString() : currentMission?.completed_at

    const { error: progressErr } = await supabase
      .from('mission_progress')
      .update({
        is_completed: isCompleted,
        best_score: newBestScore,
        attempts: (currentMission?.attempts || 0) + 1,
        completed_at: completedAt
      })
      .eq('user_id', currentUserId)
      .eq('mission_id', missionId)
      
    if (progressErr) console.error('Failed to update mission progress:', progressErr)

    // 3. Update total stars in profile
    const { data: updatedMissions } = await supabase
      .from('mission_progress')
      .select('best_score')
      .eq('user_id', currentUserId)
      
    if (updatedMissions) {
      const totalStars = updatedMissions.reduce((sum, m) => sum + (m.best_score || 0), 0)
      await supabase
        .from('profiles')
        .update({ total_stars: totalStars })
        .eq('id', currentUserId)
    }

    await fetchProfileAndProgress()
  }

  return {
    profile,
    missions,
    loading,
    errorMessage,
    fetchProfileAndProgress,
    saveMissionResult
  }
}
