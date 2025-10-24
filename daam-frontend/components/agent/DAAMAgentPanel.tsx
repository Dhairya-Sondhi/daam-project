"use client";
import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Activity,
  Loader,
  AlertCircle,
  Zap,
  Brain,
  Coins,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { apiService, AgentStatus, ContractInfo, Portfolio } from '../../lib/api';
import styles from './DAAMAgentPanel.module.css';

interface DAAMAgentPanelProps {
  className?: string;
}

const DAAMAgentPanel: React.FC<DAAMAgentPanelProps> = ({ className }) => {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({ status: 'idle', current_task: 'None' });
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(fetchAgentStatus, 2000); 
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      await apiService.checkBackend();
      setBackendConnected(true);
      setError(null);
      await Promise.all([fetchAgentStatus(), fetchContractInfo(), fetchPortfolio()]);
    } catch (error) {
      setBackendConnected(false);
      setError('DAAM backend not accessible. Please start your FastAPI server.');
    }
  };

  const fetchAgentStatus = async () => {
    if (!backendConnected) return;
    
    try {
      const status = await apiService.getAgentStatus();
      setAgentStatus(status);
      
      // Add status changes to logs
      if (status.current_task !== agentStatus.current_task) {
        addLog(`Status: ${status.current_task}`);
      }
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
    }
  };

  const fetchContractInfo = async () => {
    try {
      const info = await apiService.getContractInfo();
      setContractInfo(info);
    } catch (error) {
      console.error('Failed to fetch contract info:', error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const data = await apiService.getPortfolio();
      setPortfolio(data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp}: ${message}`, ...prev.slice(0, 9)]); // Keep last 10 logs
  };

  const handleStartAgent = async () => {
    setLoading(true);
    try {
      const response = await apiService.startAgent();
      addLog(response.message);
      await fetchAgentStatus();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to start agent';
      setError(errorMsg);
      addLog(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStopAgent = async () => {
    setLoading(true);
    try {
      const response = await apiService.stopAgent();
      addLog(response.message);
      await fetchAgentStatus();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to stop agent';
      setError(errorMsg);
      addLog(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#10b981';
      case 'idle': return '#64748b';
      case 'stopped': return '#ef4444';
      case 'completed': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader className="w-4 h-4 animate-spin" />;
      case 'idle': return <Square className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.agentCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.agentIcon}>
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className={styles.title}>DAAM Agent</h3>
              <p className={styles.subtitle}>ENS Domain Investment AI</p>
            </div>
          </div>
          
          <div className={styles.statusBadge} style={{ color: getStatusColor(agentStatus.status) }}>
            {getStatusIcon(agentStatus.status)}
            <span>{agentStatus.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Current Task */}
        <div className={styles.taskSection}>
          <div className={styles.taskLabel}>
            <Activity className="w-4 h-4" />
            Current Task
          </div>
          <div className={styles.taskValue}>
            {agentStatus.current_task}
          </div>
        </div>

        {/* Info Grid */}
        <div className={styles.infoGrid}>
          {contractInfo && (
            <div className={styles.infoItem}>
              <Zap className="w-4 h-4" />
              <div>
                <div className={styles.infoLabel}>Web3 Status</div>
                <div className={`${styles.infoValue} ${contractInfo.web3Connected ? styles.connected : styles.disconnected}`}>
                  {contractInfo.web3Connected ? '● Connected' : '● Disconnected'}
                </div>
              </div>
            </div>
          )}

          {portfolio && (
            <div className={styles.infoItem}>
              <Coins className="w-4 h-4" />
              <div>
                <div className={styles.infoLabel}>Portfolio Value</div>
                <div className={styles.infoValue}>${portfolio.totalValueUSD}</div>
              </div>
            </div>
          )}

          {contractInfo && (
            <div className={styles.infoItem}>
              <TrendingUp className="w-4 h-4" />
              <div>
                <div className={styles.infoLabel}>Contract</div>
                <div className={styles.infoValue}>
                  {contractInfo.contractAddress.slice(0, 6)}...{contractInfo.contractAddress.slice(-4)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            onClick={handleStartAgent}
            disabled={!backendConnected || agentStatus.status === 'running' || loading}
            className={`${styles.startButton} ${(!backendConnected || agentStatus.status === 'running' || loading) ? styles.disabled : ''}`}
          >
            <Play className="w-4 h-4" />
            {loading ? 'Starting...' : 'Start Agent'}
          </button>
          
          <button
            onClick={handleStopAgent}
            disabled={!backendConnected || agentStatus.status === 'idle' || agentStatus.status === 'stopped' || loading}
            className={`${styles.stopButton} ${(!backendConnected || agentStatus.status === 'idle' || agentStatus.status === 'stopped' || loading) ? styles.disabled : ''}`}
          >
            <Square className="w-4 h-4" />
            {loading ? 'Stopping...' : 'Stop Agent'}
          </button>
        </div>

        {/* Activity Logs */}
        <div className={styles.logsSection}>
          <div className={styles.logsHeader}>Activity Logs</div>
          <div className={styles.logs}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className={styles.logEntry}>
                  {log}
                </div>
              ))
            ) : (
              <div className={styles.noLogs}>No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAAMAgentPanel;
