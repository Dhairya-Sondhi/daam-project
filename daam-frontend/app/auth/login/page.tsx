"use client";
import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LogIn, Eye, EyeOff, Mail, AlertCircle } from 'lucide-react';
import styles from './login.module.css';


const Ballpit = dynamic(() => import('@/components/backgrounds/BallpitBackground'), { 
  ssr: false,
  loading: () => <div className={styles.container} />
});

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        // Get the session to ensure user is logged in
        const session = await getSession();
        if (session) {
          router.push('/dashboard');
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    // For now, create a demo user and sign them in
    try {
      setIsLoading(true);
      const result = await signIn('credentials', {
        email: `demo@${provider}.com`,
        password: 'demo123',
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Social login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.ballpitBackground}>
        <Ballpit 
          followCursor={true}
          colors={[0x3b82f6, 0x06b6d4, 0x0ea5e9, 0x1d4ed8, 0x0284c7]}
          count={80}
          gravity={0.3}
          friction={0.998}
          maxVelocity={0.1}
        />
      </div>
      
      <div className={styles.content}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <LogIn style={{color: '#3b82f6', width: '24px', height: '24px'}} />
              Sign In to DAAM
            </h1>
            <p className={styles.subtitle}>Welcome back to autonomous trading</p>
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

            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff style={{width: '16px', height: '16px'}} /> : <Eye style={{width: '16px', height: '16px'}} />}
              </button>
            </div>
            
            <div className={styles.rememberRow}>
              <label className={styles.rememberLabel}>
                <input type="checkbox" className={styles.checkbox} />
                Remember me
              </label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
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
                <LogIn style={{width: '16px', height: '16px'}} />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className={styles.divider}>
              <span className={styles.dividerText}>Or continue with</span>
            </div>
            
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton} onClick={() => handleSocialLogin('google')}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className={styles.socialButton} onClick={() => handleSocialLogin('apple')}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                Apple
              </button>
            </div>
            
            <p className={styles.footer}>
              Don't have an account? <a href="/auth/signup" className={styles.footerLink}>Sign up</a>
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
