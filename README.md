# 🤖 DAAM - Decentralized Autonomous Agent for Market Intelligence

An AI-powered autonomous agent for ENS domain investment analysis with real-time streaming capabilities and intelligent decision-making.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?style=for-the-badge&logo=fastapi)
![Web3](https://img.shields.io/badge/Web3.py-6.11-orange?style=for-the-badge&logo=ethereum)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

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

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ │ │ │ │ │
│ Next.js │◄────────│ FastAPI │◄────────│ LangGraph │
│ Dashboard │ SSE │ Backend │ │ Agent │
│ │ │ │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│ │ │
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Supabase │ │ Web3.py │ │ OpenAI/ │
│ Auth & DB │ │ Sepolia │ │ Anthropic │
└─────────────────┘ └─────────────────┘ └─────────────────┘

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
2. **Evaluate Domain** → AI scores based on investment potential
3. **Assess Risk** → Calculate risk factors
4. **Make Decision** → Autonomous buy/pass based on threshold
5. **Execute Transaction** → Blockchain purchase (if buy decision)
6. **Loop** → Continue until all domains processed

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **NextAuth.js**: Authentication system
- **Supabase**: Database and real-time subscriptions
- **CSS Modules**: Scoped styling
- **Lucide Icons**: Modern icon library
- **Server-Sent Events**: Real-time streaming

### Backend
- **FastAPI**: High-performance Python web framework
- **LangGraph**: Agent workflow orchestration
- **LangChain**: LLM integration framework
- **Web3.py**: Ethereum blockchain interaction
- **OpenAI/Anthropic**: AI evaluation models
- **Python-dotenv**: Environment management
- **Uvicorn**: ASGI server

### Blockchain & Smart Contracts
- **Sepolia Testnet**: Ethereum test network
- **ENS Domains**: Ethereum Name Service integration
- **Smart Contracts**: Solidity-based vault contract

## 📁 Project Structure

daam-project/
├── daam-frontend/ # Next.js frontend
│ ├── app/
│ │ ├── dashboard/
│ │ │ ├── page.tsx # Main dashboard with SSE
│ │ │ └── dashboard.module.css
│ │ ├── login/ # Authentication pages
│ │ ├── api/ # API routes
│ │ └── layout.tsx
│ ├── components/ # Reusable components
│ ├── public/ # Static assets
│ └── package.json
│
├── daam-backend/ # FastAPI backend
│ ├── main.py # FastAPI app with SSE endpoint
│ ├── agent_logic.py # LangGraph agent workflow
│ ├── abi.json # Smart contract ABI
│ └── requirements.txt # Python dependencies
│
├── daam-contract/ # Smart contracts
│ ├── contracts/
│ └── scripts/
│
└── README.md

text

## 🔐 Security Best Practices

⚠️ **Never commit these files:**
- `.env` files with actual credentials
- `node_modules/` directory
- `venv/` or virtual environment folders
- Private keys or wallet information
- API keys (OpenAI, Anthropic, Infura, etc.)

## 📊 Real-time Streaming

The dashboard features Server-Sent Events for live updates:

### Event Types
- **`market_scan`**: Domain discovery in progress
- **`domain_evaluation`**: AI scoring with detailed analysis
- **`risk_assessment`**: Risk calculation results
- **`decision`**: Buy/pass recommendations
- **`transaction`**: Blockchain transaction execution
- **`agent_complete`**: Workflow completion

### Example Stream Output

[10:30:45] SCANNING MARKET (LIVE) - Found 10 domains
[10:30:46] Evaluating: trojanfootball.eth
[10:30:48] Investment Score: 8.5/10 - High brandability
[10:30:49] Risk Score: 1.5 - Low risk
[10:30:50] DECISION: Buy recommended
[10:30:52] Transaction sent: 0x19e831c78bc7...
[10:30:54] ✅ Transaction successful! Block: 9277299

text

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **LangGraph** - Agent workflow orchestration
- **FastAPI** - High-performance API framework
- **Next.js** - Modern React development
- **OpenAI/Anthropic** - AI/LLM capabilities
- **Web3.py** - Ethereum integration

## 📧 Contact

**Dhairya Sondhi**
- GitHub: [@Dhairya-Sondhi](https://github.com/Dhairya-Sondhi)
- Project Link: [https://github.com/Dhairya-Sondhi/daam-project](https://github.com/Dhairya-Sondhi/daam-project)

## 🗺️ Roadmap

- [ ] Multi-chain support (Ethereum mainnet, Polygon, Arbitrum)
- [ ] Advanced portfolio analytics and performance metrics
- [ ] Machine learning model improvements
- [ ] Mobile application (React Native)
- [ ] Automated trading strategies with backtesting
- [ ] Community governance features
- [ ] Historical data analysis and trends
- [ ] Integration with more LLM providers

## 🐛 Known Issues

- Frontend folder may appear as submodule in some Git configurations
- Ensure all environment variables are properly configured

## ⚡ Performance

- **Agent Processing**: ~10 domains per minute
- **Real-time Latency**: <100ms for SSE updates
- **Transaction Confirmation**: 12-15 seconds on Sepolia
- **Dashboard Load Time**: <2 seconds
