const API_BASE_URL = 'http://localhost:8000';

export interface AgentStatus {
  status: 'idle' | 'running' | 'stopped' | 'completed';
  current_task: string;
}

export interface Portfolio {
  totalValueUSD: string;
  ensDomains: string[];
  sepoliaETH: string;
}

export interface ContractInfo {
  contractAddress: string;
  contractOwner: string;
  web3Connected: boolean;
  error?: string;
}

export interface AgentResponse {
  message: string;
  status?: string;
  current_task?: string;
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - Please check if DAAM backend is running');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Cannot connect to DAAM backend - Please ensure your FastAPI server is running on http://localhost:8000');
        }
      }
      throw error;
    }
  }

  // Backend health check
  async checkBackend(): Promise<{ message: string }> {
    return this.request('/');
  }

  // Agent control endpoints
  async getAgentStatus(): Promise<AgentStatus> {
    return this.request('/agent/status');
  }

  async startAgent(): Promise<AgentResponse> {
    return this.request('/agent/start', { method: 'POST' });
  }

  async stopAgent(): Promise<AgentResponse> {
    return this.request('/agent/stop', { method: 'POST' });
  }

  // Portfolio and contract info
  async getPortfolio(): Promise<Portfolio> {
    return this.request('/portfolio');
  }

  async getContractInfo(): Promise<ContractInfo> {
    return this.request('/contract/info');
  }
}

export const apiService = new ApiService();
