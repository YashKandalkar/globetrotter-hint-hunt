import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import UsernameForm from "@/components/UsernameForm";
import { getSessionCreatorStats } from "@/lib/supabase";
import { Award, UserCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { UserGameStats } from "@/types/supabase";

interface InviteProps {
  sessionId: string;
}

const Invite = ({ sessionId }: InviteProps) => {
  const { username, setSessionId } = useAuth();
  const [creatorStats, setCreatorStats] = useState<UserGameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [hasUsername, setHasUsername] = useState(!!username);

  useEffect(() => {
    const fetchCreatorStats = async () => {
      try {
        setLoading(true);
        const stats = await getSessionCreatorStats(sessionId);
        console.log({ stats });
        setCreatorStats(stats);
      } catch (error) {
        console.error("Error fetching creator stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      setSessionId(sessionId);
      fetchCreatorStats();
    }
  }, [sessionId, setSessionId]);

  const handleAcceptChallenge = () => {
    setShowGame(true);
  };

  const handleUsernameComplete = () => {
    setHasUsername(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-scale">
            <Award className="h-16 w-16 text-primary opacity-50" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasUsername) {
    return (
      <Layout>
        <UsernameForm onComplete={handleUsernameComplete} />
      </Layout>
    );
  }

  if (showGame) {
    return (
      <Layout>
        <GameCard />
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="glass-card border-gradient overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-medium">
              You've Been Challenged!
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 mb-6">
              <div className="flex justify-center mb-4">
                <UserCheck className="h-12 w-12 text-primary" />
              </div>

              <h3 className="text-xl font-semibold text-center mb-2">
                {creatorStats?.username} has challenged you to beat their
                score!
              </h3>

              <div className="mt-6 bg-background/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Their Current Score</p>
                  <div className="flex justify-center items-center mt-2">
                    <Award className="h-5 w-5 text-accent mr-2" />
                    <span className="text-2xl font-bold">
                      {creatorStats?.correct_answers || 0}/
                      {creatorStats?.total_games || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-foreground mb-4">
              Test your knowledge of world destinations and see if you can beat
              them!
            </p>
          </CardContent>

          <CardFooter className="bg-secondary/50 px-6 py-4 border-t">
            <Button
              onClick={handleAcceptChallenge}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6"
            >
              Accept Challenge
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Invite;
