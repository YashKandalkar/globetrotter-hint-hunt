
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Game from "./Game";
import Invite from "./Invite";
import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams.get("session");
    setSessionId(session);
  }, [searchParams]);

  return (
    <AuthProvider>
      <GameProvider>
        {sessionId ? <Invite sessionId={sessionId} /> : <Game />}
      </GameProvider>
    </AuthProvider>
  );
};

export default Index;
