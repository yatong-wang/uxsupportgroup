import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Minus, Plus, Maximize2, UserPlus, CheckCircle2 } from "lucide-react";
import logo from "@/assets/uxsg-logo-dark-bg.png";

interface ProfileCard {
  id: string;
  name: string;
  bio: string;
  profile_photo_url: string | null;
  wall_position_x: number;
  wall_position_y: number;
}

const SummitWall = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'email' | 'linkedin' | 'generating'>('email');
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name, bio, profile_photo_url, wall_position_x, wall_position_y')
        .not('name', 'is', null);

      if (error) throw error;

      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  const handleFitAll = () => {
    setZoom(100);
  };

  const handleCreateProfile = () => {
    setShowCreateModal(true);
    setCreateStep('email');
    setEmail('');
    setLinkedinUrl('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-magic-link', {
        body: { email }
      });

      if (error) throw error;

      // For development, auto-verify and move to LinkedIn step
      if (data.magicLink) {
        const url = new URL(data.magicLink);
        const token = url.searchParams.get('token');
        if (token) {
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-magic-link', {
            body: { token }
          });

          if (verifyError) throw verifyError;

          if (verifyData.valid) {
            sessionStorage.setItem('summit_email', verifyData.email);
            sessionStorage.setItem('summit_user_id', verifyData.userId || '');
            
            if (verifyData.hasProfile) {
              toast.success("Profile already exists!");
              navigate('/summit-profiles/edit');
              setShowCreateModal(false);
              return;
            }
            
            setCreateStep('linkedin');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to verify email. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLinkedinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      toast.error("Please enter a valid LinkedIn profile URL");
      return;
    }

    setCreateStep('generating');
    setIsProcessing(true);

    try {
      const storedEmail = sessionStorage.getItem('summit_email');
      if (!storedEmail) {
        toast.error("Session expired. Please start over.");
        setShowCreateModal(false);
        return;
      }

      // Generate bio using AI
      const { data: bioData, error: bioError } = await supabase.functions.invoke('generate-bio', {
        body: { linkedinUrl }
      });

      if (bioError) throw bioError;

      // Extract name from LinkedIn URL
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
          email: storedEmail,
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
      setShowCreateModal(false);
      loadProfiles();
      navigate('/summit-profiles/edit');

    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error("Failed to create profile. Please try again.");
      setCreateStep('linkedin');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardClick = (profileId: string) => {
    // For now, just show a toast. In full implementation, open detail modal
    toast.info("Click to view profile details (coming soon)");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F9FAFB] overflow-hidden relative">
      {/* Create Profile Button - Bottom Right */}
      <Button
        onClick={handleCreateProfile}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 shadow-lg z-10 h-14 px-6"
        size="lg"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Create Profile
      </Button>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-md p-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 50}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-[#1F2937] min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitAll}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div 
        className="w-full h-full overflow-auto p-8"
        style={{ 
          cursor: 'grab',
          transform: `scale(${zoom / 100})`
        }}
      >
        <div className="relative" style={{ width: '2000px', height: '1500px' }}>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="absolute bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4"
              style={{
                left: `${profile.wall_position_x || 0}px`,
                top: `${profile.wall_position_y || 0}px`,
                width: '200px',
              }}
              onClick={() => handleCardClick(profile.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] overflow-hidden flex-shrink-0">
                  {profile.profile_photo_url ? (
                    <img 
                      src={profile.profile_photo_url} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                      No photo
                    </div>
                  )}
                </div>
                
                <h3 className="text-sm font-semibold text-[#1F2937] text-center line-clamp-1">
                  {profile.name}
                </h3>
                
                <p className="text-xs text-[#6B7280] text-center line-clamp-2">
                  {profile.bio || 'No bio yet'}
                </p>
              </div>
            </div>
          ))}

          {profiles.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#9CA3AF] text-lg">No profiles yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Profile Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <img src={logo} alt="UXSG Logo" className="h-16 w-16 rounded-xl" />
            </div>
            <DialogTitle className="text-center text-2xl">
              {createStep === 'email' && 'Create Your Profile Card'}
              {createStep === 'linkedin' && 'Add Your LinkedIn Profile'}
              {createStep === 'generating' && 'Creating Your Profile...'}
            </DialogTitle>
          </DialogHeader>

          {createStep === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Progress indicator */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-sm font-semibold">
                    1
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] text-sm font-semibold">
                    2
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] text-sm font-semibold">
                    3
                  </div>
                </div>
              </div>

              <p className="text-center text-[#6B7280] text-sm mb-4">
                Welcome to the AI x UX Virtual Summit! Let's create your unique profile card.
              </p>

              <div>
                <Label htmlFor="modal-email">Email Address</Label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                  disabled={isProcessing}
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
                disabled={isProcessing}
              >
                {isProcessing ? "Verifying..." : "Continue"}
              </Button>

              <p className="text-center text-xs text-[#9CA3AF]">
                We'll verify your email to create your profile
              </p>
            </form>
          )}

          {createStep === 'linkedin' && (
            <form onSubmit={handleLinkedinSubmit} className="space-y-4">
              {/* Progress indicator */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-sm font-semibold">
                    2
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] text-sm font-semibold">
                    3
                  </div>
                </div>
              </div>

              <p className="text-center text-[#6B7280] text-sm mb-4">
                We'll pull your photo and generate a short bio from your LinkedIn profile
              </p>

              <div>
                <Label htmlFor="modal-linkedin">LinkedIn Profile URL</Label>
                <Input
                  id="modal-linkedin"
                  type="url"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="mt-2"
                  disabled={isProcessing}
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
                disabled={isProcessing}
              >
                Generate Profile
              </Button>
            </form>
          )}

          {createStep === 'generating' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6] mx-auto mb-4"></div>
              <p className="text-[#6B7280]">
                AI is analyzing your LinkedIn profile and generating your bio
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummitWall;
