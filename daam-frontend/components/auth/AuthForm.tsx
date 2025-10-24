"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Mail, Phone, ArrowRight, LogIn } from 'lucide-react';

interface AuthFormProps {
  isLogin?: boolean;
  onClose?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin = false, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(isLogin);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`w-full max-w-md backdrop-blur-xl shadow-2xl border ${
        isLoginMode 
          ? 'bg-slate-900/90 border-slate-700 animate-login-slide animate-login-glow' 
          : 'bg-purple-950/90 border-purple-700 animate-signup-bounce animate-signup-pulse'
      }`}>
        <CardHeader className="relative">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {/* Toggle buttons */}
          <div className={`flex rounded-lg p-1 mb-4 ${
            isLoginMode ? 'bg-slate-800' : 'bg-purple-900'
          }`}>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${
                !isLoginMode 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${
                isLoginMode 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign in
            </button>
          </div>
          
          <CardTitle className="text-white text-xl">
            {isLoginMode ? 'Welcome back' : 'Create account'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <Input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            
            {!isLoginMode && (
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <div className="flex">
                  <div className="flex items-center bg-gray-800 border border-gray-600 rounded-l-md px-3">
                    <span className="text-sm">🇺🇸</span>
                    <span className="ml-1 text-gray-400 text-sm">+1</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="(775) 351-6501"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="rounded-l-none bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}
            
            {isLoginMode && (
              <Input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            )}
            
            <Button 
              type="submit" 
              className={`w-full text-white font-medium py-3 ${
                isLoginMode 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isLoginMode ? <LogIn className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                {isLoginMode ? 'Sign in' : 'Create account'}
              </div>
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              Apple
            </Button>
          </div>
          
          {!isLoginMode && (
            <p className="text-xs text-gray-400 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-purple-400 hover:underline">Terms & Service</a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
