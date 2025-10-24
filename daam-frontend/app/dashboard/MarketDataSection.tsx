"use client";
import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import MarketDataCard from './MarketDataCard';
import styles from './MarketDataSection.module.css';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  icon: string;
  chartData: number[];
}

const MarketDataSection: React.FC = () => {
  // Sample market data matching your design
  const marketData: MarketData[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 108486.15,
      change: 2394.25,
      changePercent: 2.26,
      icon: "₿",
      chartData: Array.from({length: 30}, (_, i) => 108486.15 + (Math.random() - 0.4) * 3000)
    },
    {
      symbol: "ETH", 
      name: "Ethereum",
      price: 2510.62,
      change: 50.20,
      changePercent: 2.01,
      icon: "Ξ",
      chartData: Array.from({length: 30}, (_, i) => 2510.62 + (Math.random() - 0.4) * 150)
    },
    {
      symbol: "SOL",
      name: "Solana", 
      price: 225.20,
      change: 8.60,
      changePercent: 3.97,
      icon: "◎",
      chartData: Array.from({length: 30}, (_, i) => 225.20 + (Math.random() - 0.3) * 15)
    }
  ];

  return (
    <section className={styles.marketSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Live Market Data</h2>
        <div className={styles.sectionControls}>
          <button className={styles.controlButton}>
            <Search className="w-5 h-5" />
          </button>
          <button className={styles.controlButton}>
            <Filter className="w-5 h-5" />
          </button>
          <button className={styles.addButton}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className={styles.marketGrid}>
        {marketData.map((data) => (
          <MarketDataCard key={data.symbol} initialData={data} />
        ))}
      </div>
    </section>
  );
};

export default MarketDataSection;
