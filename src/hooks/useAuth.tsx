
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get current user on component mount
    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      // Clean up auth listener on unmount
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return {
    user,
    loading,
    handleSignOut,
    setUser
  };
};
