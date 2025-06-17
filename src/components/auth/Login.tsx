
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to ContentLand",
      });
      onLogin({ email: loginForm.email, id: '1' });
      setIsLoading(false);
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      toast({
        title: "Account created!",
        description: "Welcome to ContentLand",
      });
      onLogin({ email: signupForm.email, id: '1' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ContentLand</h1>
          <p className="text-white/80 text-lg">Automate your social media success</p>
        </div>

        {/* Features Preview */}
        <div className="grid gap-4 mb-8">
          <div className="flex items-center space-x-3 text-white/90">
            <Zap className="h-5 w-5 text-yellow-300" />
            <span>5 posts generated daily</span>
          </div>
          <div className="flex items-center space-x-3 text-white/90">
            <TrendingUp className="h-5 w-5 text-green-300" />
            <span>Trending topic automation</span>
          </div>
          <div className="flex items-center space-x-3 text-white/90">
            <Sparkles className="h-5 w-5 text-purple-300" />
            <span>AI-powered content creation</span>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Get Started</CardTitle>
            <CardDescription className="text-white/70">
              Sign in or create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-purple-600 hover:bg-white/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-purple-600 hover:bg-white/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
