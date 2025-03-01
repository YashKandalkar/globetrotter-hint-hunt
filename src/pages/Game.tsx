
import { useAuth } from "@/contexts/AuthContext";
import GameCard from "@/components/GameCard";
import UsernameForm from "@/components/UsernameForm";
import Layout from "@/components/Layout";
import { useState } from "react";

const Game = () => {
  const { username } = useAuth();
  const [showGame, setShowGame] = useState(!!username);

  const handleUsernameComplete = () => {
    setShowGame(true);
  };

  return (
    <Layout>
      {!showGame ? (
        <UsernameForm onComplete={handleUsernameComplete} />
      ) : (
        <GameCard />
      )}
    </Layout>
  );
};

export default Game;
