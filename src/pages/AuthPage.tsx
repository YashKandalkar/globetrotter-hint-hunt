import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SignIn } from "../components/auth/SignIn";

// UI Components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { UsernameSetup } from "../components/auth/UsernameSetup";

export default function AuthPage() {
  const { user, username, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to home
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  // Redirect if user is already logged in and has a username
  useEffect(() => {
    if (!loading && user) {
      if (username) {
        // User is fully authenticated with username, redirect to intended destination
        navigate(from, { replace: true });
      }
      // Otherwise, stay on the page to complete username setup
    }
  }, [user, username, loading, navigate, from]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Globetrotter Hint Hunt</CardTitle>
          <CardDescription>
            Test your geography knowledge with this guessing game
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && user && !username ? (
            // User is logged in but needs to set a username
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Almost there!
              </h2>
              <p className="text-center text-muted-foreground">
                Choose a username to complete your profile
              </p>
              <UsernameSetup
                onComplete={() => navigate(from, { replace: true })}
              />
            </div>
          ) : (
            // User is not logged in, show sign in form
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignIn />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
