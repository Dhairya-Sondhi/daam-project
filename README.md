# 🤖 DAAM - Decentralized Autonomous Agent for Market Intelligence

An AI-powered autonomous agent for ENS domain investment analysis with real-time streaming capabilities and intelligent decision-making.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?style=for-the-badge&logo=fastapi)
![Web3](https://img.shields.io/badge/Web3.py-6.11-orange?style=for-the-badge&logo=ethereum)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![LangGraph](https://img.shields.io/badge/LangGraph-AI-purple?style=for-the-badge)

</div>

## 🌟 Overview

DAAM is an intelligent autonomous agent that analyzes Ethereum Name Service (ENS) domains in real-time, evaluates their investment potential using AI, and executes blockchain transactions automatically. Built with a modern tech stack featuring Next.js, FastAPI, and LangGraph, it provides a beautiful real-time dashboard to monitor agent activities as they happen.

### Key Highlights

- **🧠 AI-Powered Analysis**: Uses LLMs (OpenAI/Anthropic) to evaluate domain investment scores
- **⚡ Real-time Streaming**: Server-Sent Events (SSE) for live dashboard updates
- **🔗 Blockchain Integration**: Direct Web3 interaction for automated domain purchases
- **📊 Live Monitoring**: Watch your agent think and make decisions in real-time
- **🎯 Autonomous Workflow**: LangGraph-based agent with evaluation, risk assessment, and execution

## ✨ Features

### Frontend Dashboard
- **Real-time Activity Stream**: Live logs of agent thinking process
- **Domain Evaluation Display**: See investment scores and AI analysis as they happen
- **Transaction Tracking**: Monitor blockchain transactions with hashes and block numbers
- **Progress Visualization**: Dynamic progress bars and domain counters
- **Authentication**: Secure login with NextAuth.js and Supabase
- **Responsive Design**: Beautiful UI that works on all devices

### Backend Agent System
- **Market Scanning**: Automatically discovers available ENS domains
- **AI Evaluation**: Scores domains based on brandability, market potential, and competition
- **Risk Assessment**: Calculates investment risk for each domain
- **Smart Decision Making**: Autonomous buy/pass decisions based on configurable thresholds
- **Transaction Execution**: Automated blockchain transactions on Sepolia testnet
- **Background Processing**: Non-blocking agent execution with FastAPI background tasks

## 🏗️ Architecture

The DAAM system follows a modern three-tier architecture:

### **Frontend Layer**
- **Next.js 14** with TypeScript and App Router
- **Server-Sent Events** for real-time updates
- **Supabase** for authentication and database

### **Backend Layer**
- **FastAPI** with async/await support
- **LangGraph** for agent workflow orchestration
- **Background Tasks** for non-blocking execution

### **AI & Blockchain Layer**
- **OpenAI/Anthropic** for domain evaluation
- **Web3.py** for blockchain interaction
- **Sepolia Testnet** for safe testing

### Data Flow
User Dashboard → FastAPI Backend → LangGraph Agent → AI Analysis → Blockchain
↑ ↓
└─────────── SSE Stream ─────────────┘

text

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.9+
- **Git**
- **Sepolia Testnet ETH** (get from [Sepolia faucet](https://sepoliafaucet.com/))
- **API Keys**: OpenAI or Anthropic, Infura/Alchemy for RPC

### 1. Clone Repository

git clone https://github.com/Dhairya-Sondhi/daam-project.git
cd daam-project

text

### 2. Backend Setup

cd daam-backend

Create and activate virtual environment
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

Install dependencies
pip install -r requirements.txt

Create .env file
cp .env.example .env

Edit .env with your credentials
text

**Backend Environment Variables (`.env`):**

Blockchain
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VAULT_CONTRACT_ADDRESS=0xYourContractAddress
AGENT_PRIVATE_KEY=your_private_key_here

AI/LLM
OPENAI_API_KEY=sk-your_openai_api_key

or use Anthropic
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key

text

**Start Backend:**

uvicorn main:app --reload

text

Backend runs on `http://localhost:8000`

### 3. Frontend Setup

cd ../daam-frontend

Install dependencies
npm install

or
yarn install

Create environment file
cp .env.local.example .env.local

Edit .env.local with your credentials
text

**Frontend Environment Variables (`.env.local`):**

NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here

Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

text

**Start Frontend:**

npm run dev

or
yarn dev

text

Frontend runs on `http://localhost:3000`

## 📖 Usage

1. **Start Backend**: Run `uvicorn main:app --reload` in the backend directory
2. **Start Frontend**: Run `npm run dev` in the frontend directory
3. **Login**: Navigate to `http://localhost:3000` and authenticate
4. **View Dashboard**: Monitor system status (Supabase, Backend, Agent)
5. **Start Agent**: Click "Start Agent" button to begin domain analysis
6. **Watch Live**: See real-time streaming of:
   - Market scanning for domains
   - AI evaluation scores (e.g., "trojanfootball.eth: 8.5/10")
   - Risk assessments
   - Buy/pass decisions
   - Transaction executions with hashes
7. **View Results**: Check transaction history and purchased domains

## 🎯 Agent Workflow

The DAAM agent follows this autonomous workflow:

1. **Scan Market** → Discover available ENS domains
2. **Evaluate Domain** → AI scores based on investment potential (0-10)
3. **Assess Risk** → Calculate risk factors and uncertainty
4. **Make Decision** → Autonomous buy/pass based on threshold (default: 7.0)
5. **Execute Transaction** → Blockchain purchase (if buy decision)
6. **Loop** → Continue until all domains processed

## 📁 Project Structure

daam-project/
│
├── 📂 daam-frontend/ # Next.js Frontend Application
│ ├── 📂 app/
│ │ ├── 📂 dashboard/ # Main dashboard with SSE streaming
│ │ │ ├── page.tsx # Dashboard component
│ │ │ └── dashboard.module.css
│ │ ├── 📂 login/ # Authentication pages
│ │ ├── 📂 api/ # API routes
│ │ └── layout.tsx # Root layout
│ ├── 📂 components/ # Reusable React components
│ ├── 📂 public/ # Static assets
│ ├── package.json
│ └── .env.local.example
│
├── 📂 daam-backend/ # FastAPI Backend Application
│ ├── main.py # FastAPI app with SSE endpoint
│ ├── agent_logic.py # LangGraph agent workflow
│ ├── abi.json # Smart contract ABI
│ ├── requirements.txt # Python dependencies
│ └── .env.example
│
├── 📂 daam-contract/ # Blockchain Smart Contracts
│ ├── 📂 contracts/ # Solidity contracts
│ ├── 📂 scripts/ # Deployment scripts
│ └── hardhat.config.js
│
├── .gitignore
├── README.md
└── package.json

text

## 🛠️ Tech Stack

### Frontend Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **NextAuth.js** - Authentication system
- **Supabase** - Database and real-time subscriptions
- **CSS Modules** - Scoped component styling
- **Lucide React** - Modern icon library
- **Server-Sent Events** - Real-time streaming

### Backend Technologies
- **FastAPI** - High-performance Python web framework
- **LangGraph** - Agent workflow orchestration
- **LangChain** - LLM integration framework
- **Web3.py** - Ethereum blockchain interaction
- **OpenAI/Anthropic** - AI evaluation models
- **Python-dotenv** - Environment management
- **Uvicorn** - ASGI server with auto-reload

### Blockchain & Smart Contracts
- **Sepolia Testnet** - Ethereum test network
- **ENS Domains** - Ethereum Name Service
- **Solidity** - Smart contract language
- **Hardhat** - Development environment

## 🔐 Security Best Practices

⚠️ **Never commit these sensitive files:**
- `.env` files with actual credentials
- `node_modules/` directory
- `venv/` or virtual environment folders
- Private keys or wallet information
- API keys (OpenAI, Anthropic, Infura, Alchemy)
- `.next/` build directory
- `__pycache__/` Python cache

**Always use `.gitignore`** to exclude sensitive data from your repository.

## 📊 Real-time Streaming

The dashboard uses Server-Sent Events (SSE) for real-time updates without polling:

### Event Types Streamed

| Event Type | Description |
|------------|-------------|
| `market_scan` | Domain discovery in progress |
| `domain_evaluation` | AI scoring with detailed analysis |
| `risk_assessment` | Risk calculation results |
| `decision` | Buy/pass recommendations |
| `transaction` | Blockchain transaction execution |
| `agent_complete` | Workflow completion notification |
| `heartbeat` | Keep-alive signal |

### Example Stream Output

[10:30:45] 🔍 SCANNING MARKET (LIVE) - Found 10 domains
[10:30:46] 📊 Evaluating: trojanfootball.eth
[10:30:48] 💎 Investment Score: 8.5/10 - High brandability
[10:30:49] ⚠️ Risk Score: 1.5 - Low risk
[10:30:50] ✅ DECISION: Buy recommended
[10:30:52] 🚀 Transaction sent: 0x19e831c78bc7...
[10:30:54] ✅ Transaction successful! Block: 9277299

text

## 🔧 Configuration

### Agent Configuration

Edit `daam-backend/.env` to customize agent behavior:

Investment threshold (0-10)
INVESTMENT_THRESHOLD=7.0

Maximum domains to process per run
MAX_DOMAINS=50

Recursion limit for agent workflow
RECURSION_LIMIT=50

text

### Frontend Configuration

Edit `daam-frontend/.env.local`:

Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000

Enable debug mode
NEXT_PUBLIC_DEBUG=false

text

## 🧪 Testing

### Backend Testing

cd daam-backend
pytest tests/

text

### Frontend Testing

cd daam-frontend
npm run test

or
yarn test

text

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[LangGraph](https://github.com/langchain-ai/langgraph)** - Agent workflow orchestration
- **[FastAPI](https://fastapi.tiangolo.com/)** - High-performance API framework
- **[Next.js](https://nextjs.org/)** - Modern React framework
- **[OpenAI](https://openai.com/)** / **[Anthropic](https://anthropic.com/)** - AI/LLM capabilities
- **[Web3.py](https://web3py.readthedocs.io/)** - Ethereum integration
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **ENS Community** - For domain inspiration

## 📧 Contact

**Dhairya Sondhi**
- GitHub: [@Dhairya-Sondhi](https://github.com/Dhairya-Sondhi)
- LinkedIn: [Connect with me](https://linkedin.com/in/dhairya-sondhi)
- Project Link: [https://github.com/Dhairya-Sondhi/daam-project](https://github.com/Dhairya-Sondhi/daam-project)

## 🗺️ Roadmap

### Phase 1 - Foundation ✅
- [x] Core agent workflow with LangGraph
- [x] Real-time SSE streaming
- [x] Basic dashboard UI
- [x] Sepolia testnet integration

### Phase 2 - Enhancement 🚧
- [ ] Multi-chain support (Ethereum mainnet, Polygon, Arbitrum)
- [ ] Advanced portfolio analytics and performance metrics
- [ ] Machine learning model improvements
- [ ] Historical data analysis and trends

### Phase 3 - Expansion 📅
- [ ] Mobile application (React Native)
- [ ] Automated trading strategies with backtesting
- [ ] Community governance features
- [ ] Integration with more LLM providers
- [ ] Advanced risk modeling
- [ ] Market prediction algorithms

### Phase 4 - Enterprise 🎯
- [ ] Multi-user support with role management
- [ ] White-label solution
- [ ] API access for third-party integrations
- [ ] Advanced reporting and analytics

## 🐛 Known Issues

- Frontend folder may appear as submodule in some Git configurations (workaround: remove `.git` folder from frontend)
- Large file warnings for Git pushes (ensure `.gitignore` is properly configured)
- SSE connection may timeout on slow networks (automatic reconnection implemented)

## ⚡ Performance Metrics

- **Agent Processing Speed**: ~10 domains per minute
- **Real-time Latency**: <100ms for SSE updates
- **Transaction Confirmation**: 12-15 seconds on Sepolia testnet
- **Dashboard Load Time**: <2 seconds (initial load)
- **Memory Usage**: ~200MB (backend), ~150MB (frontend)

## 📚 Documentation

For more detailed documentation:

- **[API Documentation](docs/API.md)** - FastAPI endpoints
- **[Agent Workflow](docs/AGENT.md)** - LangGraph implementation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production setup
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues

Visit our [Wiki](https://github.com/Dhairya-Sondhi/daam-project/wiki) for complete documentation.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Dhairya-Sondhi/daam-project&type=Date)](https://star-history.com/#Dhairya-Sondhi/daam-project&Date)

## 💡 Use Cases

- **Domain Investors**: Automate ENS domain discovery and evaluation
- **Researchers**: Study AI agent behavior and decision-making
- **Developers**: Learn real-time streaming and blockchain integration
- **Businesses**: Monitor and acquire valuable digital assets

---

<div align="center">
