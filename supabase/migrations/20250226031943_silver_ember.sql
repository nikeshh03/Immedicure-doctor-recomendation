/*
  # Initial Schema Setup for Immedicure

  1. New Tables
    - users
      - Basic profile information
      - Health metrics
      - Preferences
    - doctors
      - Professional information
      - Location details
      - Specializations
    
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  weight numeric,
  height numeric,
  location text NOT NULL,
  therapy_preference text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  therapy_type text NOT NULL,
  experience_years integer NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  contact_number text,
  email text UNIQUE NOT NULL,
  rating numeric DEFAULT 0,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for doctors table
CREATE POLICY "Anyone can read doctors data"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (true);