import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const SummitVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'expired' | 'invalid' | 'error'>('verifying');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('invalid');
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-magic-link', {
        body: { token }
      });

      if (error) throw error;

      if (!data.valid) {
        setStatus(data.reason || 'invalid');
        return;
      }

      // Store session data in localStorage
      sessionStorage.setItem('summit_email', data.email);
      sessionStorage.setItem('summit_user_id', data.userId || '');

      // Navigate based on whether user has profile
      if (data.hasProfile) {
        navigate('/summit-profiles/edit');
      } else {
        navigate('/summit-profiles/setup');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setStatus('error');
    }
  };

  const handleResend = () => {
    navigate('/summit-profiles');
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#DDD6FE]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6] mx-auto mb-4"></div>
          <p className="text-[#6B7280] text-lg">Verifying your magic link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#DDD6FE] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-[#F59E0B]" />
          </div>

          <h1 className="text-3xl font-bold text-[#1F2937] mb-4">
            Link {status === 'expired' ? 'Expired' : 'Invalid'}
          </h1>

          <p className="text-[#6B7280] mb-8">
            {status === 'expired' 
              ? "Your magic link has expired. Let's send you a new one!"
              : "This link is invalid or has already been used. Please request a new one."
            }
          </p>

          {email && (
            <p className="text-sm text-[#9CA3AF] mb-4">
              Email Address: {email}
            </p>
          )}

          <Button
            onClick={handleResend}
            className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 text-white font-semibold rounded-lg"
          >
            Send New Magic Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummitVerify;
