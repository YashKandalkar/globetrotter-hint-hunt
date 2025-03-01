import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UsernameSetup } from "./UsernameSetup";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loader2 } from "lucide-react";

interface AuthRequiredProps {
  children: ReactNode;
  requireUsername?: boolean;
}

export function AuthRequired({
  children,
  requireUsername = true,
}: AuthRequiredProps) {
  const { user, loading, username } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>
              Checking authentication status...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If username is required but not set, show username setup
  if (requireUsername && !username) {
    return (
      <div className="container max-w-lg py-8">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Welcome to Globetrotter Hint Hunt!</CardTitle>
            <CardDescription>
              Before you continue, please choose a username for your profile.
            </CardDescription>
          </CardHeader>
        </Card>
        <UsernameSetup />
      </div>
    );
  }

  // User is authenticated and username is set (if required)
  return <>{children}</>;
}
