import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Globe,
  Award,
  Map,
  MapPin,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useState } from "react";
import Confetti from "./Confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GameCard = () => {
  const {
    currentDestination,
    options,
    loading,
    userAnswer,
    answerResult,
    loadNewGame,
    submitAnswer,
    score,
  } = useGame();

  const [showConfetti, setShowConfetti] = useState(false);

  if (loading || !currentDestination) {
    return (
      <Card className="w-full max-w-xl glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-center">
            Loading...
          </CardTitle>
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
    console.log("answer", answer, currentDestination.city);
    if (answer === currentDestination.city) {
      setShowConfetti(true);
      console.log("showing confetti");
    }
  };

  const getClue = () => {
    if (currentDestination.clues && currentDestination.clues.length > 0) {
      return currentDestination.clues.slice(0, 2).map((clue, index) => (
        <p key={index} className="text-lg my-2 leading-relaxed">
          <span className="font-bold cursor-pointer">{index + 1}. </span>
          {clue}
        </p>
      ));
    }
    return <p>No clues available</p>;
  };

  return (
    <>
      <Confetti show={showConfetti} />
      <Card className="w-full max-w-xl glass-card border-gradient overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-medium text-center">
            Where in the world?
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Guess the destination based on the clues
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <motion.div
            animate={{
              opacity: userAnswer ? 0.8 : 1,
              scale: userAnswer ? 0.98 : 1,
            }}
            transition={{ duration: 0.3 }}
            className={`bg-primary/10 rounded-lg p-4 mb-6 ${
              userAnswer ? "border border-primary/10" : ""
            }`}
          >
            {getClue()}
          </motion.div>

          <AnimatePresence>
            {!userAnswer ? (
              <motion.div
                key="options"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {options.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="py-6 px-4 text-lg hover-scale border border-primary/20 h-auto"
                      onClick={() => handleAnswer(option.city)}
                    >
                      <span className="break-words text-center text-wrap">
                        {option.city}, {option.country}
                      </span>
                    </Button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className={`p-4 rounded-lg mb-4 flex items-start ${
                    answerResult?.correct
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  <div className="mr-3 mt-1">
                    {answerResult?.correct ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-xl">
                      {answerResult?.correct ? "Correct!" : "Not quite right!"}
                    </h3>
                    <p className="mb-2">
                      {userAnswer === currentDestination.city
                        ? `You guessed it! ${currentDestination.city}, ${currentDestination.country}.`
                        : `The correct answer is ${currentDestination.city}, ${currentDestination.country}.`}
                    </p>

                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-2 mt-1"
                    >
                      <span className="text-xs text-muted-foreground">
                        Explore:
                      </span>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={() => {
                              const mapUrl = `https://www.google.com/maps/place/${encodeURIComponent(
                                `${currentDestination.city}, ${currentDestination.country}`,
                              )}/data=!3m1!1e3`;
                              window.open(mapUrl, "_blank");
                            }}
                          >
                            <MapPin className="h-3.5 w-3.5 text-accent" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Street View</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={() => {
                              const earthUrl = `https://earth.google.com/web/search/${`${currentDestination.city},+${currentDestination.country}`}/`;
                              window.open(earthUrl, "_blank");
                            }}
                          >
                            <Globe className="h-3.5 w-3.5 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>3D Earth View</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <h4 className="font-semibold text-accent mb-2 flex items-center">
                    <motion.span
                      initial={{ rotate: -5 }}
                      animate={{ rotate: 5 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1,
                      }}
                    >
                      ✨
                    </motion.span>
                    <span className="mx-2">Did you know?</span>
                    <motion.span
                      initial={{ rotate: 5 }}
                      animate={{ rotate: -5 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1,
                      }}
                    >
                      ✨
                    </motion.span>
                  </h4>
                  <p>{answerResult?.fact}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t bg-secondary/50 px-6 py-4">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-accent mr-2" />
            <span className="text-sm font-medium">
              Current Score: {score.correct}/{score.total}
            </span>
          </div>

          {userAnswer && (
            <Button
              onClick={() => {
                setShowConfetti(false);
                loadNewGame();
              }}
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
