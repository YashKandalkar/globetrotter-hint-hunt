import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Destination, AnswerResult } from "../types/supabase";
import {
  getRandomDestination,
  getMultipleDestinations,
  checkAnswer,
  updateUserScore,
} from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  currentDestination: Destination | null;
  options: Destination[];
  loading: boolean;
  error: string | null;
  userAnswer: string | null;
  answerResult: AnswerResult | null;
  score: { correct: number; total: number };
  loadNewGame: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentDestination, setCurrentDestination] =
    useState<Destination | null>(null);
  const [options, setOptions] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const { user } = useAuth();
  const { toast } = useToast();

  const resetGame = () => {
    setUserAnswer(null);
    setAnswerResult(null);
  };

  const loadNewGame = async () => {
    try {
      setLoading(true);
      resetGame();

      // Get a random destination for the question
      const destination = await getRandomDestination();

      if (!destination?.length) {
        throw new Error("Failed to fetch destination");
      }
      setCurrentDestination(destination[0]);

      // Get additional destinations for the options (including the correct answer)
      const additionalDestinations = await getMultipleDestinations(3);

      // Create final options array with correct answer randomly placed
      const allOptions = [...additionalDestinations];
      const correctAnswerIndex = Math.floor(Math.random() * 4);
      allOptions.splice(correctAnswerIndex, 0, destination[0]);

      // Take only the first 4 options (in case we got more than 3 additional)
      setOptions(allOptions.slice(0, 4));
    } catch (err) {
      console.error("Error loading game:", err);
      setError("Failed to load game data");
      toast({
        title: "Error",
        description: "Failed to load game data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    try {
      setLoading(true);
      setUserAnswer(answer);

      if (!currentDestination) {
        throw new Error("No current destination");
      }

      const result = await checkAnswer(currentDestination.id, answer);
      setAnswerResult(result[0]);

      // Update score
      setScore((prev) => ({
        correct: prev.correct + (result[0].correct ? 1 : 0),
        total: prev.total + 1,
      }));

      // Update user score in database if logged in
      if (user) {
        await updateUserScore(user.id, result[0].correct);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer");
      toast({
        title: "Error",
        description: "Failed to submit your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial game on mount
  useEffect(() => {
    loadNewGame();
  }, []);

  const value = {
    currentDestination,
    options,
    loading,
    error,
    userAnswer,
    answerResult,
    score,
    loadNewGame,
    submitAnswer,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
