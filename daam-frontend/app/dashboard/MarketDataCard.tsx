"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import styles from './MarketDataSection.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  icon: string;
  chartData: number[];
}

interface MarketDataCardProps {
  initialData: MarketData;
}

const MarketDataCard: React.FC<MarketDataCardProps> = ({ initialData }) => {
  const [data, setData] = useState<MarketData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      setTimeout(() => {
        setData(prev => {
          const changePercent = (Math.random() - 0.5) * 0.02; // Smaller changes for realism
          const newPrice = prev.price * (1 + changePercent);
          const priceChange = newPrice - prev.price;
          
          return {
            ...prev,
            price: newPrice,
            change: priceChange,
            changePercent: changePercent * 100,
            chartData: [...prev.chartData.slice(-29), newPrice]
          };
        });
        setIsLoading(false);
      }, 300);
    }, 4000 + Math.random() * 2000); // 4-6 second intervals

    return () => clearInterval(interval);
  }, []);

  const isPositive = data.changePercent >= 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { 
        display: false,
        grid: { display: false }
      },
      y: { 
        display: false,
        grid: { display: false }
      },
    },
    elements: {
      point: { radius: 0 },
      line: { 
        borderWidth: 2,
        tension: 0.4
      },
    },
    interaction: {
      intersect: false,
    },
  };

  const chartDataConfig = {
    labels: data.chartData.map((_, index) => index),
    datasets: [
      {
        data: data.chartData,
        borderColor: isPositive ? '#10B981' : '#EF4444',
        backgroundColor: isPositive 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <div className={styles.marketCard}>
      <div className={styles.cardHeader}>
        <div className={styles.tokenIcon}>{data.icon}</div>
        <div className={styles.tokenInfo}>
          <h3 className={styles.tokenSymbol}>{data.symbol}</h3>
          <p className={styles.tokenName}>{data.name}</p>
        </div>
        <button className={styles.menuButton}>
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.price}>
          ${data.price.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </div>
        <div className={`${styles.priceChange} ${isPositive ? styles.priceChangePositive : styles.priceChangeNegative}`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>
            {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <Line data={chartDataConfig} options={chartOptions} />
      </div>

      {isLoading && (
        <div className={styles.loadingIndicator}></div>
      )}
    </div>
  );
};

export default MarketDataCard;
