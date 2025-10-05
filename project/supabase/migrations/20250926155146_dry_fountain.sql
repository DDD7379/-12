/*
  # Add admin role to profiles table

  1. Changes
    - Add `is_admin` column to profiles table
    - Set default admin user (you can change this email)

  2. Security
    - Only admins can view admin status of others
*/

-- Add is_admin column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Set a default admin user (change this email to your admin email)
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';

-- You can also manually set an admin user by running:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';