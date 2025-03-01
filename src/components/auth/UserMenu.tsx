import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

// UI Components
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, Trophy, User } from "lucide-react";

export function UserMenu() {
  const { user, username, userStats, signOut } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="User menu"
        >
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {username || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        {userStats && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Stats</DropdownMenuLabel>
            <DropdownMenuItem className="flex justify-between">
              <span className="flex items-center">
                <Trophy className="mr-2 h-4 w-4 text-amber-500" />
                Correct Answers
              </span>
              <span className="font-semibold">
                {userStats.correct_answers}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between">
              <span className="flex items-center">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                Games Played
              </span>
              <span className="font-semibold">{userStats.total_games}</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
