
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { createGameSession } from "@/lib/supabase";

const ChallengeForm = () => {
  const { user, username, userStats, setSessionId } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleCreateChallenge = async () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "You need to log in to challenge friends.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Create a new game session in the database
      const session = await createGameSession(user.id);
      
      if (!session) {
        throw new Error("Failed to create game session");
      }
      
      // Set the session ID in our context/localStorage
      setSessionId(session.id);
      
      // Create the share URL
      const shareUrl = `${window.location.origin}?session=${session.id}`;
      setShareUrl(shareUrl);
      
      // Show the dialog
      setShowDialog(true);
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleShare = async () => {
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: "Globetrotter Challenge",
          text: `${username} has challenged you to a game of Globetrotter! Can you beat their score?`,
          url: shareUrl,
        });
        
        toast({
          title: "Shared!",
          description: "Your challenge has been shared.",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // If share API fails or is cancelled, fall back to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback for browsers that don't support the Share API
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Challenge link copied to clipboard",
    });
  };
  
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `${username} has challenged you to a game of Globetrotter! Can you beat their score? ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };
  
  const downloadShareImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "globetrotter-challenge.png";
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate share image.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Button
        onClick={handleCreateChallenge}
        className="bg-accent hover:bg-accent/90 text-white"
        disabled={isCreating}
      >
        <Share2 className="mr-2 h-4 w-4" />
        {isCreating ? "Creating..." : "Challenge a Friend"}
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Challenge a Friend</DialogTitle>
            <DialogDescription>
              Share this challenge with your friends to see if they can beat your score!
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 flex justify-center">
            <div 
              ref={cardRef} 
              className="w-full max-w-sm p-6 bg-gradient-to-br from-primary/90 to-accent/90 rounded-lg text-white shadow-lg"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">Globetrotter Challenge</h3>
                <p className="opacity-90 text-sm">From: {username}</p>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-lg font-semibold">{username}'s Score</p>
                  <div className="text-3xl font-bold mt-1">
                    {userStats?.correct_answers || 0}/{userStats?.total_games || 0}
                  </div>
                  <p className="text-sm mt-2 opacity-90">Can you beat it?</p>
                </div>
              </div>
              
              <div className="mt-4 text-center text-sm opacity-90">
                <p>Scan the QR code or click the link to play!</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={shareUrl}
                readOnly
              />
              <Button 
                className="px-3" 
                variant="secondary" 
                onClick={copyToClipboard}
              >
                Copy
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={shareToWhatsApp} variant="outline" className="flex-1 mr-2">
                Share to WhatsApp
              </Button>
              <Button onClick={downloadShareImage} variant="outline" className="flex-1 ml-2">
                Download Image
              </Button>
            </div>
            
            <Button 
              onClick={handleShare} 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Share Challenge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChallengeForm;
