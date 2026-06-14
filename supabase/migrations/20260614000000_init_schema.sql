-- ============================================
-- Cosmic Math Adventure - Database Migration
-- ============================================

-- 1. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_stars INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Mission Progress table
CREATE TABLE public.mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id INTEGER NOT NULL CHECK (mission_id BETWEEN 1 AND 4),
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score BETWEEN 0 AND 5),
  attempts INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, mission_id)
);

ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;

-- 3. Game Sessions table
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id INTEGER NOT NULL,
  questions_total INTEGER NOT NULL DEFAULT 5,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX game_sessions_user_id_idx ON public.game_sessions(user_id);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- mission_progress
CREATE POLICY "Users can read own progress"
  ON mission_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON mission_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- game_sessions
CREATE POLICY "Users can read own sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Database Triggers
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Buat profil
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );

  -- Unlock Misi 1 otomatis
  INSERT INTO public.mission_progress (user_id, mission_id, is_unlocked)
  VALUES (NEW.id, 1, true);

  -- Buat entry locked untuk Misi 2-4
  INSERT INTO public.mission_progress (user_id, mission_id, is_unlocked)
  VALUES
    (NEW.id, 2, false),
    (NEW.id, 3, false),
    (NEW.id, 4, false);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Auto-unlock next mission
CREATE OR REPLACE FUNCTION public.handle_mission_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- Jika misi baru saja diselesaikan dengan skor >= 3
  IF NEW.is_completed = true AND NEW.best_score >= 3 AND NEW.mission_id < 4 THEN
    UPDATE public.mission_progress
    SET is_unlocked = true
    WHERE user_id = NEW.user_id
      AND mission_id = NEW.mission_id + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_mission_completed
  AFTER UPDATE ON public.mission_progress
  FOR EACH ROW
  WHEN (OLD.is_completed = false AND NEW.is_completed = true)
  EXECUTE FUNCTION public.handle_mission_complete();
