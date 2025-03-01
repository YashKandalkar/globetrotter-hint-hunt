import { createClient } from "@supabase/supabase-js";
import {
  Destination,
  AnswerResult,
  UserProfile,
  GameSession,
  UserGameStats,
} from "../types/supabase";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signInWithEmail = async (email: string) => {
  console.log("signInWithEmail", email, window.location.origin);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Game data functions
export const getRandomDestination = async (): Promise<
  Destination[] | null
> => {
  try {
    const { data, error } = await supabase.rpc("get_random_destination");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching random destination:", error);
    return null;
  }
};

export const getMultipleDestinations = async (
  count: number,
): Promise<Destination[]> => {
  try {
    const { data, error } = await supabase.rpc("get_multiple_destinations", {
      count_param: count,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
};

export const checkAnswer = async (
  destinationId: number,
  userGuess: string,
): Promise<AnswerResult[]> => {
  try {
    const { data, error } = await supabase.rpc("check_destination_answer", {
      destination_id: destinationId,
      user_guess: userGuess,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error checking answer:", error);
    return [
      {
        correct: false,
        fact: "There was an error checking your answer.",
      },
    ];
  }
};

// User profile and game session functions
export const createOrUpdateUserProfile = async (
  userId: string,
  username: string,
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({
        id: userId,
        username,
        score: 0,
        games_played: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return null;
  }
};

export const getUserStats = async (
  userId: string,
): Promise<UserGameStats | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("score,games_played,username")
      .eq("id", userId)
      .single();
    console.log({ data, userId, error });
    if (error) throw error;

    return {
      correct_answers: data.score,
      total_games: data.games_played,
      username: data.username,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
};

export const updateUserScore = async (
  userId: string,
  correct: boolean,
): Promise<void> => {
  try {
    const { error } = await supabase.rpc("update_user_score", {
      user_id: userId,
      is_correct: correct,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error updating user score:", error);
  }
};

export const createGameSession = async (
  creatorId: string,
): Promise<GameSession | null> => {
  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .insert({
        creator_id: creatorId,
        current_score: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating game session:", error);
    return null;
  }
};

export const getSessionCreatorStats = async (
  sessionId: string,
): Promise<UserGameStats | null> => {
  try {
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .select("creator_id")
      .eq("id", sessionId)
      .single();
    console.log({ session });
    if (sessionError) throw sessionError;

    return await getUserStats(session.creator_id);
  } catch (error) {
    console.error("Error fetching session creator stats:", error);
    return null;
  }
};
