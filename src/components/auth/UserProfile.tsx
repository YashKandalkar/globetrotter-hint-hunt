import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

// UI Components
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { LogOut, Trophy, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UsernameSetup } from "./UsernameSetup";

export function UserProfile() {
  const { user, username, userStats, signOut } = useAuth();
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>{username || "User"}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {userStats && (
          <>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                  <Trophy className="h-5 w-5 text-amber-500 mb-1" />
                  <span className="text-xl font-bold">
                    {userStats.correct_answers}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Correct Answers
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                  <User className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-xl font-bold">
                    {userStats.total_games}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Games Played
                  </span>
                </div>
              </div>
            </div>

            <Separator />
          </>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Account
          </h3>
          <div className="space-y-2">
            <Dialog
              open={isEditingUsername}
              onOpenChange={setIsEditingUsername}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Change Username
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Username</DialogTitle>
                  <DialogDescription>
                    Choose a new username for your profile
                  </DialogDescription>
                </DialogHeader>
                <UsernameSetup
                  onComplete={() => setIsEditingUsername(false)}
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full justify-start text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        <p>User ID: {user.id.substring(0, 8)}...</p>
      </CardFooter>
    </Card>
  );
}
