"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Settings,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Wifi,
  WifiOff,
  CheckCircle,
  Play,
  Square,
  Activity,
  Loader,
  Zap,
  Brain,
  Coins,
  Globe
} from 'lucide-react';
import styles from './dashboard.module.css';
import { useAgentStream } from '@/hooks/useAgentStream';

// Normalize BACKEND_URL and fallback host
function normalizeBackendUrl(raw?: string) {
  const url = (raw || '').trim();
  if (!url) return 'http://127.0.0.1:8000';
  return url.replace('http://localhost', 'http://127.0.0.1');
}

const BACKEND_URL = normalizeBackendUrl(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000');

// REST helpers
const api = {
  checkBackend: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/`, { method: 'GET', signal: AbortSignal.timeout(7000) });
      return response.ok;
    } catch {
      return false;
    }
  },
  startAgent: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/agent/start`, { method: 'POST' });
      if (response.ok) return await response.json();
    } catch {}
    return { message: 'Backend not available' };
  },
  stopAgent: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/agent/stop`, { method: 'POST' });
      if (response.ok) return await response.json();
    } catch {}
    return { message: 'Backend not available' };
  },
  getPortfolio: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/portfolio`);
      if (response.ok) return await response.json();
    } catch {}
    return null;
  }
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isSupabaseOnline, setIsSupabaseOnline] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [agentLoading, setAgentLoading] = useState(false);
  const [showOnlineBanner, setShowOnlineBanner] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  // Realtime agent stream (SSE)
  const { status: agent, feed } = useAgentStream(BACKEND_URL);

  // If we ever receive any SSE event, we consider the stream connected
  const streamConnected = useMemo(() => feed.length > 0 || agent.status !== 'idle', [feed.length, agent.status]);

  // Connection checks
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const checkConnections = async () => {
      // Supabase check (simplified)
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const supabaseResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
            method: 'GET',
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            signal: AbortSignal.timeout(5000)
          });
          setIsSupabaseOnline(supabaseResponse.ok);
        } else {
          setIsSupabaseOnline(true);
        }
      } catch {
        setIsSupabaseOnline(false);
      }

      // Backend health probe
      const backendStatus = await api.checkBackend();
      setIsBackendOnline(backendStatus);

      setConnectionChecked(true);
    };

    checkConnections();
    const interval = setInterval(checkConnections, 30000);
    return () => clearInterval(interval);
  }, [status, router]);

  // Portfolio data fetching
  useEffect(() => {
    const fetchPortfolio = async () => {
      const data = await api.getPortfolio();
      setPortfolioData(data);
    };

    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const forceRefresh = () => window.location.reload();

  const handleStartAgent = async () => {
    setAgentLoading(true);
    try {
      await api.startAgent();
    } finally {
      setAgentLoading(false);
    }
  };

  const handleStopAgent = async () => {
    setAgentLoading(true);
    try {
      await api.stopAgent();
    } finally {
      setAgentLoading(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'running': return '#10b981';
      case 'idle': return '#64748b';
      case 'stopped': return '#ef4444';
      case 'completed': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'running': return <Loader className="w-4 h-4 animate-spin" />;
      case 'idle': return <Square className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  if (status === 'loading' || !connectionChecked) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) return null;

  // Show agent controls if backend is online OR we have a live stream connection
  const canShowControls = isBackendOnline || streamConnected;

  return (
    <div className={styles.container}>
      {/* Connection Status Banner */}
      {!isSupabaseOnline && (
        <div className={styles.offlineBanner}>
          <WifiOff className="w-5 h-5" />
          <span>Supabase is currently restoring. Working in offline mode...</span>
          <button onClick={forceRefresh} className={styles.retryButton}>
            <Wifi className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {isSupabaseOnline && showOnlineBanner && (
        <div className={styles.onlineBanner}>
          <CheckCircle className="w-5 h-5" />
          <span>🎉 All systems online! Portfolio tracking active.</span>
          <button onClick={() => setShowOnlineBanner(false)} className={styles.dismissButton}>×</button>
        </div>
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}><BarChart3 className="w-5 h-5" /></div>
          <span>DAAM TOOLS</span>
        </div>

        <nav>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>MAIN MENU</div>
            <ul className={styles.sidebarNav}>
              <li>
                <a href="#" className={`${styles.sidebarItem} ${styles.active}`}>
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li><a href="#" className={styles.sidebarItem}><TrendingUp className="w-4 h-4" /><span>ENS Domains</span></a></li>
              <li><a href="#" className={styles.sidebarItem}><Wallet className="w-4 h-4" /><span>Portfolio</span></a></li>
            </ul>
          </div>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>OTHER</div>
            <ul className={styles.sidebarNav}>
              <li><a href="#" className={styles.sidebarItem}><Settings className="w-4 h-4" /><span>Settings</span></a></li>
            </ul>
          </div>
        </nav>

        <div className={styles.upgradeBox}>
          <div className={styles.upgradeIcon}>🚀</div>
          <h3 className={styles.upgradeTitle}>Upgrade Premium</h3>
          <p className={styles.upgradeDescription}>Unlock advanced DAAM features and insights</p>
          <button className={styles.upgradeButton}>Subscribe</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Good Morning, {session.user?.name || 'DAAM User'}!</h1>
            <p className={styles.headerSubtitle}>
              {isSupabaseOnline && (isBackendOnline || streamConnected)
                ? 'All systems online. Monitor your DAAM agent and grow your ENS portfolio.'
                : isSupabaseOnline
                ? 'Database online. Start your DAAM backend to enable full functionality.'
                : 'Working in offline mode while systems restore.'}
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.chainSelector}><span>11155111</span><span>Sepolia</span><ChevronDown className="w-4 h-4" /></div>
            <button className={styles.connectButton}>Connect Wallet</button>
            <div className={styles.userMenu}>
              <div className={styles.userAvatar}><UserIcon className="w-4 h-4" /></div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{session.user?.name}</div>
                <div className={styles.userEmail}>{session.user?.email}</div>
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </header>

        {/* System Status Cards */}
        <section className={styles.systemStatus}>
          <div className={styles.statusGrid}>
            <div className={`${styles.statusCard} ${isSupabaseOnline ? styles.online : styles.offline}`}>
              <div className={styles.statusIcon}><Globe className="w-5 h-5" /></div>
              <div className={styles.statusInfo}><h3>Supabase Database</h3><p className={styles.statusValue}>{isSupabaseOnline ? 'Online' : 'Offline'}</p></div>
            </div>

            <div className={`${styles.statusCard} ${(isBackendOnline || streamConnected) ? styles.online : styles.offline}`}>
              <div className={styles.statusIcon}><Zap className="w-5 h-5" /></div>
              <div className={styles.statusInfo}>
                <h3>DAAM Backend</h3>
                <p className={styles.statusValue}>{(isBackendOnline || streamConnected) ? 'Online' : 'Offline'}</p>
                <button
                  onClick={async () => setIsBackendOnline(await api.checkBackend())}
                  className={styles.retryButton}
                  style={{ marginTop: 8 }}
                >
                  Retry
                </button>
              </div>
            </div>

            <div className={`${styles.statusCard} ${agent.status === 'running' ? styles.active : styles.idle}`}>
              <div className={styles.statusIcon}><Brain className="w-5 h-5" /></div>
              <div className={styles.statusInfo}>
                <h3>AI Agent</h3>
                <p className={styles.statusValue}>{agent.status?.toUpperCase?.() || 'IDLE'}</p>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Step: {agent.current_task || '-'}{agent.current_domain ? ` • ${agent.current_domain}` : ''}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Progress: {agent.progress?.done || 0}/{agent.progress?.total || 0}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DAAM Agent Control Panel */}
        {canShowControls && (
          <section className={styles.agentPanel}>
            <div className={styles.agentCard}>
              <div className={styles.agentHeader}>
                <div className={styles.agentTitleSection}>
                  <div className={styles.agentIcon}><Brain className="w-6 h-6" /></div>
                  <div>
                    <h3 className={styles.agentTitle}>DAAM Agent</h3>
                    <p className={styles.agentSubtitle}>ENS Domain Investment AI</p>
                  </div>
                </div>
                <div className={styles.agentStatusBadge} style={{ color: getStatusColor(agent.status) }}>
                  {getStatusIcon(agent.status)}<span>{agent.status?.toUpperCase?.() || 'IDLE'}</span>
                </div>
              </div>

              <div className={styles.agentInfo}>
                <div className={styles.agentTask}>
                  <Activity className="w-4 h-4" />
                  <span>
                    Current Task: {agent.current_task || 'None'}
                    {agent.current_domain ? ` — ${agent.current_domain}` : ''}
                  </span>
                </div>
              </div>

              <div className={styles.agentControls}>
                <button
                  onClick={handleStartAgent}
                  disabled={agentLoading || agent.status === 'running'}
                  className={`${styles.agentButton} ${styles.startButton} ${(agentLoading || agent.status === 'running') ? styles.disabled : ''}`}
                >
                  <Play className="w-4 h-4" />
                  {agentLoading ? 'Starting...' : 'Start Agent'}
                </button>

                <button
                  onClick={handleStopAgent}
                  disabled={agentLoading || agent.status === 'idle'}
                  className={`${styles.agentButton} ${styles.stopButton} ${(agentLoading || agent.status === 'idle') ? styles.disabled : ''}`}
                >
                  <Square className="w-4 h-4" />
                  {agentLoading ? 'Stopping...' : 'Stop Agent'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Portfolio & Performance Stats */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Coins className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>Portfolio Value</h3>
                <p className={styles.statValue}>
                  ${portfolioData?.totalValueUSD || '0.00'}
                </p>
                <span className={styles.statLabel}>
                  {portfolioData && parseFloat(portfolioData.profitLossUSD || '0') !== 0 && (
                    <span style={{ 
                      color: parseFloat(portfolioData.profitLossUSD) >= 0 ? '#10b981' : '#ef4444',
                      fontSize: '11px'
                    }}>
                      {portfolioData.profitLossUSD} ({portfolioData.profitLossPercent})
                    </span>
                  )}
                  {!portfolioData || parseFloat(portfolioData.profitLossUSD || '0') === 0 ? 'USD' : ''}
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><Globe className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>ENS Domains</h3>
                <p className={styles.statValue}>{portfolioData?.domainsOwned || 0}</p>
                <span className={styles.statLabel}>Owned</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><Activity className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>Score</h3>
                <p className={styles.statValue}>{agent.last_score ?? '-'}</p>
                <span className={styles.statLabel}>Latest</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><Activity className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>Decision</h3>
                <p className={styles.statValue}>{agent.last_decision ?? '-'}</p>
                <span className={styles.statLabel}>Latest</span>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Summary */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Wallet className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>Total Invested</h3>
                <p className={styles.statValue}>
                  ${portfolioData?.totalInvestedUSD || '0.00'}
                </p>
                <span className={styles.statLabel}>
                  {portfolioData?.totalValueETH || '0.0000'} ETH
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><Activity className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>Last Transaction</h3>
                <p className={styles.statValue}>
                  {agent.last_tx_hash ? (
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${agent.last_tx_hash}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: '#60a5fa', textDecoration: 'underline' }}
                    >
                      {agent.last_tx_hash.slice(0, 10)}…
                    </a>
                  ) : '-'}
                </p>
                <span className={styles.statLabel}>Etherscan</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><Globe className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>Backend Stream</h3>
                <p className={styles.statValue}>{(BACKEND_URL || '').replace('http://', '')}</p>
                <span className={styles.statLabel}>SSE source</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><TrendingUp className="w-5 h-5" /></div>
              <div className={styles.statContent}>
                <h3>Risk Level</h3>
                <p className={styles.statValue}>{agent.last_risk ?? '-'}</p>
                <span className={styles.statLabel}>Latest</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Activity Feed */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Live Activity</h2>
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '12px',
            maxHeight: 300,
            overflow: 'auto'
          }}>
            {feed.length === 0 && (
              <div style={{ color: '#94a3b8', fontSize: 14 }}>No events yet — start the agent to see live updates and portfolio growth.</div>
            )}
            {feed.map((e: any, idx: number) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '110px 110px 1fr',
                gap: '8px',
                padding: '6px 4px',
                borderBottom: '1px dashed rgba(139,92,246,0.2)'
              }}>
                <div style={{ color: '#64748b', fontSize: 12 }}>
                  {e?.ts ? new Date(e.ts * 1000).toLocaleTimeString() : ''}
                </div>
                <div style={{ 
                  color: e.type === 'tx_confirmed' ? '#10b981' : e.type === 'decision' && e.decision === 'buy' ? '#f59e0b' : '#c4b5fd', 
                  fontSize: 12, 
                  textTransform: 'uppercase' 
                }}>
                  {e.type}
                </div>
                <div style={{ color: '#e5e7eb', fontSize: 13 }}>
                  {e.type === 'step' && e.message}
                  {e.type === 'domains' && `Loaded ${e.domains?.length} domains`}
                  {e.type === 'score' && `Score ${e.domain}: ${e.score}`}
                  {e.type === 'risk' && `Risk ${e.domain}: ${e.risk}`}
                  {e.type === 'decision' && (
                    <span style={{ 
                      color: e.decision === 'buy' ? '#10b981' : '#64748b',
                      fontWeight: e.decision === 'buy' ? 'bold' : 'normal'
                    }}>
                      Decision {e.domain}: {e.decision} (score {e.score}, risk {e.risk})
                    </span>
                  )}
                  {e.type === 'tx_sending' && (
                    <span style={{ color: '#f59e0b' }}>
                      💰 Buying {e.domain} for {e.value_eth} ETH
                    </span>
                  )}
                  {e.type === 'tx_confirmed' && (
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                      ✅ Purchase confirmed: {e.domain}
                    </span>
                  )}
                  {e.type === 'progress' && `Progress ${e.done}/${e.total}`}
                  {e.type === 'complete' && `🎉 Investment run complete`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions Section */}
        {!(isBackendOnline || streamConnected) && (
          <section className={styles.instructionsSection}>
            <div className={styles.instructionsCard}>
              <h3>🚀 Start Your DAAM Backend</h3>
              <p>To enable full functionality and portfolio tracking, start your Python backend:</p>
              <div className={styles.codeBlock}>
                <code>cd daam-backend<br/>uvicorn main:app --reload</code>
              </div>
              <p>Your backend should run on <strong>{BACKEND_URL}</strong></p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
