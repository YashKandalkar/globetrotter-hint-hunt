import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Award, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChallengeForm from "./ChallengeForm";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { username, userStats, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/50">
      <div className="container mx-auto py-8 px-4">
        <motion.header
          className="flex flex-col gap-4 sm:flex-row justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground">Welcome, {username}!</p>

          <div className="flex items-center space-x-4">
            {username && (
              <>
                <div className="flex items-center bg-secondary rounded-full px-4 py-2">
                  <Award className="h-5 w-5 text-accent mr-2" />
                  <span className="text-sm font-medium">
                    {userStats?.correct_answers || 0}/
                    {userStats?.total_games || 0}
                  </span>
                </div>

                <ChallengeForm />
              </>
            )}
          </div>
        </motion.header>

        <main>
          <div className="flex justify-center">{children}</div>
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Globetrotter Challenge &copy; {new Date().getFullYear()} | Test
            your knowledge of famous destinations
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
