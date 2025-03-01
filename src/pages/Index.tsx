import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Game from "./Game";
import Invite from "./Invite";
import { useAuth } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";
import { AuthRequired } from "@/components/auth";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { setSessionId: setAuthSessionId } = useAuth();

  useEffect(() => {
    const session = searchParams.get("session");
    setSessionId(session);

    // Update session ID in auth context for tracking
    if (session) {
      setAuthSessionId(session);
    }
  }, [searchParams, setAuthSessionId]);

  return (
    <AuthRequired>
      <GameProvider>
        {sessionId ? <Invite sessionId={sessionId} /> : <Game />}
      </GameProvider>
    </AuthRequired>
  );
};

export default Index;
