/*
  # Create Admin Management Tables

  1. New Tables
    - `posts` - News posts and updates
      - `id` (text, primary key) - Unique post identifier
      - `title` (text) - Post title
      - `summary` (text) - Brief summary
      - `content` (text) - Full post content
      - `image_url` (text, nullable) - Post image URL
      - `publish_date` (date) - Publication date
      - `author` (text) - Author name
      - `author_id` (uuid, nullable) - Reference to profiles
      - `tags` (text array) - Post tags
      - `language` (text) - Language code
      - `status` (text) - Draft or published
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `applications` - Join applications
      - `id` (uuid, primary key) - Unique application ID
      - `discord_handle` (text) - Discord username
      - `roblox_username` (text) - Roblox username
      - `roblox_profile_link` (text) - Roblox profile URL
      - `age` (integer) - Applicant age
      - `country` (text) - Country
      - `timezone` (text) - Timezone
      - `email` (text) - Email address
      - `languages` (text) - Spoken languages
      - `motivation` (text) - Why they want to join
      - `scenario1` (text) - Answer to scenario 1
      - `scenario2` (text) - Answer to scenario 2
      - `weekly_availability` (text) - Hours available
      - `accepted_conduct` (boolean) - Code of conduct accepted
      - `guardian_consent` (boolean, nullable) - Parental consent
      - `project_links` (text, nullable) - Portfolio links
      - `status` (text) - Pending, approved, or rejected
      - `created_at` (timestamptz) - Submission timestamp

    - `contacts` - Contact form submissions
      - `id` (uuid, primary key) - Unique contact ID
      - `name` (text) - Sender name (Discord username)
      - `email` (text) - Email address
      - `roblox_username` (text, nullable) - Roblox username
      - `subject` (text) - Message subject
      - `message` (text) - Message content
      - `created_at` (timestamptz) - Submission timestamp

  2. Security
    - Enable RLS on all tables
    - Admin users can read and manage all data
    - Public can insert applications and contacts
    - Public can read published posts only
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  image_url text,
  publish_date date DEFAULT CURRENT_DATE,
  author text NOT NULL,
  author_id uuid REFERENCES profiles(id),
  tags text[] DEFAULT '{}',
  language text DEFAULT 'en',
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can manage all posts"
  ON posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_handle text NOT NULL,
  roblox_username text NOT NULL,
  roblox_profile_link text NOT NULL,
  age integer NOT NULL,
  country text NOT NULL,
  timezone text NOT NULL,
  email text NOT NULL,
  languages text NOT NULL,
  motivation text NOT NULL,
  scenario1 text NOT NULL,
  scenario2 text NOT NULL,
  weekly_availability text NOT NULL,
  accepted_conduct boolean DEFAULT false,
  guardian_consent boolean,
  project_links text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit applications"
  ON applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete applications"
  ON applications FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  roblox_username text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit contacts"
  ON contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);
CREATE INDEX IF NOT EXISTS posts_language_idx ON posts(language);
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
CREATE INDEX IF NOT EXISTS applications_created_at_idx ON applications(created_at);
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts(created_at);