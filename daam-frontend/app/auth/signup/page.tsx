"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Sparkles, UserPlus, Eye, EyeOff, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './signup.module.css';

// Rest of your signup component stays the same...


const Ballpit = dynamic(() => import('@/components/backgrounds/BallpitBackground'), { 
  ssr: false,
  loading: () => <div className={styles.container} />
});

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // First, register the user
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Registration failed');
      }

      // If registration successful, automatically sign in the user
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Registration successful, but login failed. Please try logging in manually.');
      } else if (signInResult?.ok) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'apple') => {
    // For demo purposes, create a user and sign them in
    try {
      setIsLoading(true);
      
      // Create demo user data
      const demoData = {
        firstName: 'Demo',
        lastName: 'User',
        email: `demo-${Date.now()}@${provider}.com`,
        phone: '+919876543210',
        password: 'demo123'
      };

      // Register demo user
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoData),
      });

      if (signupResponse.ok) {
        const signInResult = await signIn('credentials', {
          email: demoData.email,
          password: demoData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Social signup error:', error);
      setError('Social signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.ballpitBackground}>
        <Ballpit 
          followCursor={true}
          colors={[0x8b5cf6, 0xa855f7, 0xec4899, 0xd946ef, 0x9333ea]}
          count={120}
          gravity={0.2}
          friction={0.999}
          maxVelocity={0.08}
        />
      </div>
      
      <div className={styles.content}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <Sparkles style={{color: '#a855f7', width: '24px', height: '24px'}} />
              Join DAAM
            </h1>
            <p className={styles.subtitle}>Start your autonomous trading journey</p>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#10b981',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <div className={styles.nameRow}>
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`${styles.input} ${styles.inputWithIcon}`}
                required
              />
            </div>
            
            <div className={styles.phoneRow}>
              <Phone className={styles.phoneIcon} />
              <div className={styles.countryCode}>
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={styles.phoneInput}
                maxLength={10}
                pattern="[0-9]{10}"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={styles.input}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff style={{width: '16px', height: '16px'}} /> : <Eye style={{width: '16px', height: '16px'}} />}
              </button>
            </div>
            
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <UserPlus style={{width: '16px', height: '16px'}} />
              )}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div className={styles.divider}>
              <span className={styles.dividerText}>Or continue with</span>
            </div>
            
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton} onClick={() => handleSocialSignup('google')}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className={styles.socialButton} onClick={() => handleSocialSignup('apple')}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                Apple
              </button>
            </div>
            
            <p className={styles.terms}>
              By creating an account, you agree to our{' '}
              <a href="#" className={styles.termsLink}>Terms & Service</a>
              {' '}and{' '}
              <a href="#" className={styles.termsLink}>Privacy Policy</a>
            </p>
            
            <p className={styles.footer}>
              Already have an account? <a href="/auth/login" className={styles.footerLink}>Sign in</a>
            </p>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
