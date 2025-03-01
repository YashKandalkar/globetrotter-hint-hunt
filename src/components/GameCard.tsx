
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, Globe, Award } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useState } from "react";
import Confetti from "./Confetti";
import { motion, AnimatePresence } from "framer-motion";

const GameCard = () => {
  const {
    currentDestination,
    options,
    loading,
    userAnswer,
    answerResult,
    loadNewGame,
    submitAnswer,
    score
  } = useGame();
  
  const [showConfetti, setShowConfetti] = useState(false);

  if (loading || !currentDestination) {
    return (
      <Card className="w-full max-w-xl glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-center">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse-scale">
            <Globe className="h-16 w-16 text-primary opacity-50" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAnswer = async (answer: string) => {
    await submitAnswer(answer);
    if (answer === currentDestination.city) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getClue = () => {
    if (currentDestination.clues && currentDestination.clues.length > 0) {
      return currentDestination.clues.slice(0, 2).map((clue, index) => (
        <p key={index} className="text-lg my-2 leading-relaxed">{clue}</p>
      ));
    }
    return <p>No clues available</p>;
  };

  return (
    <>
      <Confetti show={showConfetti} />
      <Card className="w-full max-w-xl glass-card border-gradient overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-medium text-center">Where in the world?</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Guess the destination based on the clues
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            {getClue()}
          </div>

          {!userAnswer ? (
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="py-6 px-4 text-lg hover-scale border border-primary/20"
                  onClick={() => handleAnswer(option.city)}
                >
                  <span>{option.city}, {option.country}</span>
                </Button>
              ))}
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <div className={`p-4 rounded-lg mb-4 flex items-start ${
                  answerResult?.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <div className="mr-3 mt-1">
                    {answerResult?.correct ? 
                      <CheckCircle2 className="h-5 w-5" /> : 
                      <XCircle className="h-5 w-5" />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      {answerResult?.correct ? 'Correct!' : 'Not quite right!'}
                    </h3>
                    <p>
                      {userAnswer === currentDestination.city 
                        ? `You guessed it! ${currentDestination.city}, ${currentDestination.country}.` 
                        : `The correct answer is ${currentDestination.city}, ${currentDestination.country}.`}
                    </p>
                    <p className="mt-2">{answerResult?.fact}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center border-t bg-secondary/50 px-6 py-4">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-accent mr-2" />
            <span className="text-sm font-medium">Score: {score.correct}/{score.total}</span>
          </div>
          
          {userAnswer && (
            <Button 
              onClick={loadNewGame}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Next Question
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default GameCard;
