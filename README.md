# ⛓️ ChainBoard

> A feed-style Web3 discussion platform for multi-chain communities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Chains](https://img.shields.io/badge/chains-Stellar%20%7C%20Ethereum-purple)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## 🌐 What is ChainBoard?

ChainBoard is an open-source, feed-style discussion platform built for Web3 communities. It lets developers, builders, and blockchain enthusiasts across different chains — starting with **Stellar** and **Ethereum** — share ideas, discuss projects, ask questions, and reward great content with crypto tips.

Think of it as **Twitter/X meets Reddit, built natively for Web3.**

---

## ✨ Features

- 🐦 **Feed-style posts** — share thoughts, updates, and questions in a familiar format
- 🔗 **Multi-chain support** — Stellar and Ethereum to start, with more chains coming
- 🔐 **Dual authentication** — sign in with GitHub OAuth or your Web3 wallet (Freighter / MetaMask)
- 💸 **On-chain tipping** — reward great posts with USDC directly on-chain
- 🗳️ **Upvote system** — community-driven content ranking
- 🏷️ **Chain tags** — filter and discover content by blockchain ecosystem
- 👤 **Builder profiles** — showcase your projects, contributions, and on-chain activity
- 🔔 **Notifications** — stay updated on replies, tips, and mentions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, TailwindCSS |
| Backend | NestJS, PostgreSQL |
| Smart Contracts | Soroban (Stellar), Solidity (Ethereum) |
| Auth | GitHub OAuth, Freighter Wallet, MetaMask |
| Payments | Stellar USDC, ERC-20 USDC |

---

## 📁 Project Structure

```
chainboard/
├── frontend/          # React + TypeScript UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
├── backend/           # NestJS REST API
│   ├── src/
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── users/
│   │   ├── tips/
│   │   └── notifications/
├── contracts/         # Smart contracts
│   ├── stellar/       # Soroban contracts
│   └── ethereum/      # Solidity contracts
└── docs/              # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- pnpm
- PostgreSQL
- A Stellar wallet (Freighter)
- A MetaMask wallet (for Ethereum features)

### Installation

```bash
# Clone the repository
git clone https://github.com/chainboard-app/chainboard.git
cd chainboard

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your env variables

# Run database migrations
pnpm run migration:run

# Start development servers
pnpm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chainboard

# Auth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret

# Stellar
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Ethereum
ETH_RPC_URL=your_eth_rpc_url
```

---

## 🤝 Contributing

We welcome contributions of all kinds! ChainBoard is built in the open, for the community.

### How to contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Good first issues

Check out issues tagged [`good first issue`](https://github.com/chainboard-app/chainboard/issues?q=is%3Aissue+label%3A%22good+first+issue%22) to get started.

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🌍 Community

- 🐦 Twitter/X: coming soon
- 💬 Discord: Coming soon
- 📖 Docs: Coming soon

---

## 🙏 Acknowledgements

Built with love for the Stellar and Ethereum communities.
Supported by [GrantFox](https://grantfox.xyz) — open source grants platform.

---

<p align="center">Made with ❤️ by the ChainBoard team</p>
