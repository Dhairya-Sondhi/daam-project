"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Sparkles, UserPlus, Eye, EyeOff } from 'lucide-react';

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup:', formData);
  };

  return (
    <Card className="w-full max-w-md bg-purple-950/90 border-purple-700 backdrop-blur-xl animate-signup-bounce animate-signup-pulse">
      <CardHeader>
        <CardTitle className="text-white text-2xl text-center flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-400" />
          Join DAAM
        </CardTitle>
        <p className="text-purple-300 text-center text-sm">Start your autonomous trading journey</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="bg-purple-900 border-purple-600 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
              required
            />
            <Input
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="bg-purple-900 border-purple-600 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
              required
            />
          </div>
          
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="pl-10 bg-purple-900 border-purple-600 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
              required
            />
          </div>
          
          <div className="relative group">
            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
            <div className="flex">
              <div className="flex items-center bg-purple-900 border border-purple-600 rounded-l-md px-3 border-r-0">
                <span className="text-sm">🇺🇸</span>
                <span className="ml-1 text-purple-300 text-sm">+1</span>
              </div>
              <Input
                type="tel"
                placeholder="(775) 351-6501"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="rounded-l-none pl-10 bg-purple-900 border-purple-600 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
              />
            </div>
          </div>
          
          <div className="relative group">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="pr-10 bg-purple-900 border-purple-600 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-purple-300 hover:text-purple-400 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 shadow-lg transition-all duration-300"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-purple-950 px-3 text-purple-300">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="bg-purple-900 border-purple-600 hover:bg-purple-800 text-white">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button variant="outline" className="bg-purple-900 border-purple-600 hover:bg-purple-800 text-white">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
            </svg>
            Apple
          </Button>
        </div>
        
        <p className="text-xs text-purple-300 text-center leading-relaxed">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-purple-400 hover:underline">Terms & Service</a>
          {' '}and{' '}
          <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
        </p>
        
        <p className="text-center text-sm text-purple-300">
          Already have an account? <a href="/auth/login" className="text-purple-400 hover:underline">Sign in</a>
        </p>
      </CardContent>
    </Card>
  );
};
