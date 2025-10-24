"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  TrendingUp, 
  Shield, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Globe,
  Brain
} from 'lucide-react';
import Prism from '@/components/backgrounds/Prism';
import styles from './landing.module.css';

const features = [
  {
    id: 1,
    title: "AI-Powered Analysis",
    description: "Advanced LangGraph algorithms analyze market trends and ENS domain values in real-time",
    icon: <Brain className="w-16 h-16 text-purple-400" />,
  },
  {
    id: 2,
    title: "Smart Execution", 
    description: "Autonomous trading with EIP-1559 transactions and intelligent gas optimization",
    icon: <Zap className="w-16 h-16 text-blue-400" />,
  },
  {
    id: 3,
    title: "Secure Vault",
    description: "OpenZeppelin-secured smart contracts with user-controlled asset management",
    icon: <Shield className="w-16 h-16 text-green-400" />,
  },
  {
    id: 4,
    title: "Global Reach",
    description: "24/7 monitoring of ENS markets across multiple blockchain networks", 
    icon: <Globe className="w-16 h-16 text-indigo-400" />,
  },
  {
    id: 5,
    title: "Market Intelligence",
    description: "Real-time analytics and predictive modeling for optimal trading decisions",
    icon: <TrendingUp className="w-16 h-16 text-orange-400" />,
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const getVisibleFeatures = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (activeIndex + i + features.length) % features.length;
      visible.push({ ...features[index], position: i });
    }
    return visible;
  };

  return (
    <div className={styles.landingContainer}>
      {/* Enhanced Prism Background */}
      <div className={styles.lightRaysBackground}>
        <Prism
          height={5}
          baseWidth={7}
          animationType="3drotate"
          glow={3}
          noise={0.2}
          transparent={true}
          scale={2.5}
          hueShift={4.8}
          colorFrequency={0.8}
          bloom={2}
          timeScale={0.4}
          // suspendWhenOffscreen={false}
        />
      </div>
      
      {/* Header */}
      <header className={styles.header}>
        <motion.div 
          className={styles.logo}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Bot className="h-8 w-8 text-purple-400" />
          <span className={styles.logoText}>DAAM</span>
        </motion.div>
        
        <motion.div 
          className={styles.headerActions}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            onClick={() => router.push('/auth/login')}
            className={styles.signInButton}
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push('/auth/signup')}
            className={styles.getStartedButton}
          >
            Get Started
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroContent}
          >
            <motion.h1 
              className={styles.heroTitle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className={styles.heroTitlePrimary}>Transform Your</span>
              <br />
              <span className={styles.heroTitleSecondary}>Crypto Journey</span>
            </motion.h1>
            
            <motion.p 
              className={styles.heroDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience enhanced security, speed, and convenience with our cutting-edge 
              <span className={styles.heroHighlight}> AI-powered autonomous asset manager</span>.
              Built with LangGraph and advanced ML algorithms.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={styles.heroCredit}
            >
              Created By <span className={styles.heroCreditHighlight}>DAAM Team</span>
            </motion.div>

            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button 
                onClick={() => router.push('/auth/signup')}
                className={styles.startTradingButton}
              >
                Start Trading <ArrowRight className="w-5 h-5" />
              </button>
              <button className={styles.viewDemoButton}>
                View Demo
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Carousel Section */}
        <div className={styles.carouselSection}>
          <motion.div 
            className={styles.carouselContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className={styles.carouselViewport}>
              <AnimatePresence mode="popLayout" initial={false}>
                {getVisibleFeatures().map((feature) => (
                  <motion.div
                    key={feature.id}
                    className={`${styles.carouselCard} ${
                      feature.position === 0 ? styles.carouselCardCenter : styles.carouselCardSide
                    }`}
                    custom={{ direction, position: feature.position }}
                    variants={{
                      enter: ({ direction }) => ({
                        scale: 0.8,
                        x: direction < 0 ? -300 : 300,
                        opacity: 0,
                        rotateY: direction < 0 ? -45 : 45,
                      }),
                      center: ({ position }) => ({
                        scale: position === 0 ? 1 : 0.85,
                        x: position * 320,
                        opacity: position === 0 ? 1 : 0.7,
                        rotateY: position * 15,
                        zIndex: position === 0 ? 30 : 10,
                      }),
                      exit: ({ direction }) => ({
                        scale: 0.8,
                        x: direction < 0 ? 300 : -300,
                        opacity: 0,
                        rotateY: direction < 0 ? 45 : -45,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }}
                  >
                    <div className={styles.carouselIcon}>
                      {feature.icon}
                    </div>
                    
                    <h3 className={styles.carouselCardTitle}>
                      {feature.title}
                    </h3>
                    
                    <p className={styles.carouselCardDescription}>
                      {feature.description}
                    </p>
                    
                    {feature.position === 0 && (
                      <div className={styles.sparkleIcon}>
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className={styles.carouselControls}>
              <button
                onClick={handlePrev}
                className={styles.carouselButton}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className={styles.carouselButton}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className={styles.carouselDots}>
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  className={`${styles.carouselDot} ${
                    index === activeIndex ? styles.carouselDotActive : styles.carouselDotInactive
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
