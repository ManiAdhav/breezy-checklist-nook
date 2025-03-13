
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthFormProps {
  onSignInSuccess: (user: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        onSignInSuccess(data.user);
      }
      
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
};

export default AuthForm;
