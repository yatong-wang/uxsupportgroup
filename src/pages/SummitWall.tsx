import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Maximize2 } from "lucide-react";

interface ProfileCard {
  id: string;
  name: string;
  bio: string;
  profile_photo_url: string | null;
  wall_position_x: number;
  wall_position_y: number;
}

const SummitWall = () => {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F9FAFB] overflow-hidden relative">
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
    </div>
  );
};

export default SummitWall;
