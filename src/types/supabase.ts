
export type Destination = {
  id: number;
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
  created_at?: string;
};

export type UserProfile = {
  id: string;
  username: string;
  score: number;
  games_played: number;
  created_at: string;
};

export type GameSession = {
  id: string;
  creator_id: string;
  current_score: number;
  created_at: string;
};

export type UserGameStats = {
  correct_answers: number;
  total_games: number;
  username: string;
};

export type AnswerResult = {
  correct: boolean;
  fact: string;
};
