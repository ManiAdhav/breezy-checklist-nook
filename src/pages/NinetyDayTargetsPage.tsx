
import React, { useEffect, useState } from 'react';
import { GoalProvider } from '@/contexts/GoalContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { VisionProvider } from '@/contexts/VisionContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MilestoneList from '@/components/targets/MilestoneList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const NinetyDayTargetsPage: React.FC = () => {
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
  
  // Handle sign in/up
  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Authentication error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    }
  };
  
  // Handle sign out
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  // If user is not logged in, show auth screen
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Milestones</h1>
          
          <p className="mb-6 text-muted-foreground text-center">
            Sign in to save your goals, milestones, and track your progress over time.
          </p>
          
          <Button 
            onClick={handleSignIn} 
            className="w-full mb-4"
          >
            Sign in with Google
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <VisionProvider>
      <TaskProvider>
        <GoalProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Header user={user} onSignOut={handleSignOut} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <MilestoneList user={user} />
            </div>
            <FloatingActionButton />
          </div>
        </GoalProvider>
      </TaskProvider>
    </VisionProvider>
  );
};

export default NinetyDayTargetsPage;
