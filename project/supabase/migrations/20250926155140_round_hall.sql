/*
  # Create learning progress table

  1. New Tables
    - `learning_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `lesson_id` (text)
      - `completed` (boolean)
      - `current_step` (integer)
      - `quiz_completed` (boolean)
      - `quiz_score` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `learning_progress` table
    - Add policy for users to manage their own progress
*/

CREATE TABLE IF NOT EXISTS learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id text NOT NULL,
  completed boolean DEFAULT false,
  current_step integer DEFAULT 0,
  quiz_completed boolean DEFAULT false,
  quiz_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own learning progress"
  ON learning_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER on_learning_progress_updated
  BEFORE UPDATE ON learning_progress
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();