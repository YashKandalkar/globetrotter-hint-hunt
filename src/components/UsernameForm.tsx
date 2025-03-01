
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface UsernameFormProps {
  onComplete: () => void;
}

const UsernameForm = ({ onComplete }: UsernameFormProps) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUsername: saveUsername } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await saveUsername(username);
      onComplete();
    } catch (err) {
      console.error("Error setting username:", err);
      setError("Failed to set username. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md glass-card border-gradient">
        <CardHeader>
          <CardTitle className="text-2xl font-medium text-center">Welcome to Globetrotter</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Choose a username to start your adventure
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  className="h-12"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
            
            <CardFooter className="px-0 pt-6">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 h-12 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Start Playing"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsernameForm;
