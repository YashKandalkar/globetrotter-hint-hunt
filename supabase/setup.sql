
-- Create destinations table
CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  clues TEXT[] NOT NULL,
  fun_fact TEXT[] NOT NULL,
  trivia TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create game sessions table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create secure function to get a random destination
CREATE OR REPLACE FUNCTION get_random_destination()
RETURNS SETOF destinations
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM destinations
  ORDER BY random()
  LIMIT 1;
$$;

-- Create secure function to get multiple random destinations
CREATE OR REPLACE FUNCTION get_multiple_destinations(count_param INTEGER)
RETURNS SETOF destinations
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM destinations
  ORDER BY random()
  LIMIT count_param;
$$;

-- Create secure function to check if an answer is correct and return a fact
CREATE OR REPLACE FUNCTION check_destination_answer(destination_id INTEGER, user_guess TEXT)
RETURNS TABLE(correct BOOLEAN, fact TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  destination_city TEXT;
  random_fact TEXT;
BEGIN
  -- Get the destination city
  SELECT city INTO destination_city
  FROM destinations
  WHERE id = destination_id;
  
  -- Check if the answer is correct
  IF destination_city = user_guess THEN
    -- Get a random fun fact for correct answers
    SELECT fun_fact[floor(random() * array_length(fun_fact, 1)) + 1] INTO random_fact
    FROM destinations
    WHERE id = destination_id;
    
    RETURN QUERY SELECT true as correct, random_fact as fact;
  ELSE
    -- Get a random trivia fact for incorrect answers
    SELECT trivia[floor(random() * array_length(trivia, 1)) + 1] INTO random_fact
    FROM destinations
    WHERE id = destination_id;
    
    RETURN QUERY SELECT false as correct, random_fact as fact;
  END IF;
END;
$$;

-- Create secure function to update user score
CREATE OR REPLACE FUNCTION update_user_score(user_id UUID, is_correct BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles
  SET 
    score = CASE WHEN is_correct THEN score + 1 ELSE score END,
    games_played = games_played + 1
  WHERE id = user_id;
END;
$$;

-- Insert sample data
INSERT INTO destinations (city, country, clues, fun_fact, trivia)
VALUES 
  (
    'Paris',
    'France',
    ARRAY['This city is home to a famous tower that sparkles every night.', 'Known as the ''City of Love'' and a hub for fashion and art.'],
    ARRAY['The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!', 'Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules.'],
    ARRAY['This city is famous for its croissants and macarons. Bon appétit!', 'Paris was originally a Roman city called Lutetia.']
  ),
  (
    'Tokyo',
    'Japan',
    ARRAY['This city has the busiest pedestrian crossing in the world.', 'You can visit an entire district dedicated to anime, manga, and gaming.'],
    ARRAY['Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!', 'More than 14 million people live in Tokyo, making it one of the most populous cities in the world.'],
    ARRAY['The city has over 160,000 restaurants, more than any other city in the world.', 'Tokyo''s subway system is so efficient that train delays of just a few minutes come with formal apologies.']
  ),
  (
    'New York',
    'USA',
    ARRAY['Home to a green statue gifted by France in the 1800s.', 'Nicknamed ''The Big Apple'' and known for its Broadway theaters.'],
    ARRAY['The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.', 'Times Square was once called Longacre Square before being renamed in 1904.'],
    ARRAY['New York City has 468 subway stations, making it one of the most complex transit systems in the world.', 'The Empire State Building has its own zip code: 10118.']
  );

-- Set up Row Level Security
-- Enable RLS on all tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
-- Users can only view any profile
CREATE POLICY "Users can view any profile"
  ON user_profiles
  FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policies for game_sessions
-- Users can view any game session
CREATE POLICY "Users can view any game session"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only create their own game sessions
CREATE POLICY "Users can only create their own game sessions"
  ON game_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Users can only update their own game sessions
CREATE POLICY "Users can only update their own game sessions"
  ON game_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);
