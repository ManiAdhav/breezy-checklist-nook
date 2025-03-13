
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NinetyDayTargetsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
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
  
  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Authentication error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    }
  };
  
  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your account',
      });
    } catch (error: any) {
      toast({
        title: 'Registration error',
        description: error.message || 'Failed to sign up',
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Milestones</h1>
          
          <p className="mb-6 text-muted-foreground text-center">
            {isSignUp ? 'Create an account to get started' : 'Sign in to save your goals, milestones, and track your progress over time.'}
          </p>
          
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-6">
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
