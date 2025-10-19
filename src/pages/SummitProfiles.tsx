import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/uxsg-logo-dark-bg.png";

const SummitProfiles = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-magic-link', {
        body: { email }
      });

      if (error) throw error;

      toast.success("Magic link sent! Check your console (email integration pending)");
      
      // In development, automatically navigate to verify page
      if (data.magicLink) {
        const url = new URL(data.magicLink);
        const token = url.searchParams.get('token');
        if (token) {
          navigate(`/summit-profiles/verify?token=${token}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#DDD6FE] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="UXSG Logo" className="h-24 w-24 rounded-xl" />
          </div>

          <h1 className="text-4xl font-bold text-center mb-4 text-[#1F2937]">
            Create Your Profile Card
          </h1>
          
          <p className="text-center text-[#6B7280] mb-8">
            Welcome to the AI x UX Virtual Summit! Let's create your unique profile card.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#1F2937]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 text-white font-semibold rounded-lg shadow-lg shadow-[#8B5CF6]/30 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            We'll email you a secure link to access your profile card (valid 24 hours)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummitProfiles;
