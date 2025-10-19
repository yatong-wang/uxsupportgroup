import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const SummitSetup = () => {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      toast.error("Please enter a valid LinkedIn profile URL");
      return;
    }

    setIsGenerating(true);

    try {
      const email = sessionStorage.getItem('summit_email');
      if (!email) {
        toast.error("Session expired. Please start over.");
        navigate('/summit-profiles');
        return;
      }

      // Generate bio using AI
      const { data: bioData, error: bioError } = await supabase.functions.invoke('generate-bio', {
        body: { linkedinUrl }
      });

      if (bioError) throw bioError;

      // Extract name from LinkedIn URL (simple approach)
      const urlParts = linkedinUrl.split('/in/')[1]?.split('/')[0]?.split('-') || [];
      const name = urlParts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ') || 'UX Professional';

      // Create slug from name
      const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          email,
          name,
          bio: bioData.bio,
          linkedin_url: linkedinUrl,
          slug,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      sessionStorage.setItem('summit_user_id', profile.id);
      toast.success("Profile created successfully!");
      navigate('/summit-profiles/edit');

    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#DDD6FE] p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress indicator */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-semibold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-[#10B981]">1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-[#8B5CF6]">2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-[#9CA3AF]">3</span>
            </div>
          </div>

          {!isGenerating ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-4 text-[#1F2937]">
                Add Your LinkedIn Profile
              </h1>
              
              <p className="text-center text-[#6B7280] mb-8">
                We'll pull your photo and generate a short bio from your LinkedIn profile
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="linkedin" className="text-sm font-medium text-[#1F2937]">
                    LinkedIn Profile URL
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="mt-2 border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 text-white font-semibold rounded-lg shadow-lg shadow-[#8B5CF6]/30"
                >
                  Generate Profile
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6] mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                Creating Your Profile...
              </h2>
              <p className="text-[#6B7280]">
                AI is analyzing your LinkedIn profile and generating your bio
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummitSetup;
