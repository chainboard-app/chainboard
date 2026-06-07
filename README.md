# ⛓️ ChainBoard

> A feed-style Web3 discussion and tipping platform for multi-chain developer communities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Chains](https://img.shields.io/badge/chains-Stellar%20%7C%20Ethereum-purple)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Built With](https://img.shields.io/badge/built%20with-React%20%7C%20NestJS%20%7C%20Soroban-informational)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Maintainers](#-maintainers)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🌐 Overview

ChainBoard is an open-source, feed-style discussion platform purpose-built for Web3 communities. It bridges the gap between social discourse and on-chain interaction — giving developers, builders, and blockchain enthusiasts a space to share ideas, collaborate on projects, and directly reward high-quality contributions with cryptocurrency tips.

Think of it as **Twitter/X meets Reddit, built natively for Web3** — with real on-chain value exchange at its core.

ChainBoard currently supports the **Stellar** and **Ethereum** ecosystems, with a modular architecture designed to expand to additional chains over time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🐦 Feed-style posts | Share thoughts, updates, and questions in a familiar social format |
| 🔗 Multi-chain support | Stellar and Ethereum to start, with architecture ready for expansion |
| 🔐 Dual authentication | Sign in via GitHub OAuth or a Web3 wallet (Freighter / MetaMask) |
| 💸 On-chain tipping | Reward great posts with USDC directly on-chain — no intermediaries |
| 🗳️ Upvote system | Community-driven content ranking to surface the best discussions |
| 🏷️ Chain tags | Filter and discover content by blockchain ecosystem |
| 👤 Builder profiles | Showcase projects, contributions, and on-chain activity |
| 🔔 Notifications | Real-time updates on replies, tips, and mentions |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, TailwindCSS |
| Backend | NestJS, PostgreSQL |
| Smart Contracts | Soroban (Stellar), Solidity (Ethereum) |
| Authentication | GitHub OAuth, Freighter Wallet, MetaMask |
| Payments | Stellar USDC, ERC-20 USDC |

---

## 🏗️ Architecture

ChainBoard is structured as a monorepo with three distinct layers:

- **Frontend** — A React + TypeScript SPA that communicates with the backend REST API and interfaces with wallet extensions directly from the browser.
- **Backend** — A NestJS service responsible for user management, post storage, authentication, and bridging between the frontend and the blockchain.
- **Smart Contracts** — On-chain tipping and transaction logic deployed on Stellar (via Soroban) and Ethereum (via Solidity). The contracts are intentionally minimal — they handle only value transfer and event emission.

---

## 📁 Project Structure

```
chainboard/
├── frontend/              # React + TypeScript UI
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Route-level page components
│       ├── hooks/         # Custom React hooks
│       └── utils/         # Helper functions and constants
│
├── backend/               # NestJS REST API
│   └── src/
│       ├── auth/          # GitHub OAuth + wallet authentication
│       ├── posts/         # Post creation, retrieval, and upvotes
│       ├── users/         # User profiles and settings
│       ├── tips/          # On-chain tipping integration
│       └── notifications/ # Notification service
│
├── contracts/             # Smart contracts
│   ├── stellar/           # Soroban (Rust) contracts
│   └── ethereum/          # Solidity contracts
│
└── docs/                  # Documentation and guides
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your system before proceeding:

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Freighter Wallet](https://www.freighter.app/) (for Stellar features)
- [MetaMask](https://metamask.io/) (for Ethereum features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/chainboard-app/chainboard.git
cd chainboard

# 2. Install all dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in the required values (see below)

# 4. Run database migrations
pnpm run migration:run

# 5. Start the development servers
pnpm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:4000` by default.

---

## 🔐 Environment Variables

Create a `.env` file at the root of the project based on `.env.example`. The following variables are required:

```env
# ─── Database ───────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/chainboard

# ─── Authentication ─────────────────────────────────────────
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret

# ─── Stellar ────────────────────────────────────────────────
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# ─── Ethereum ───────────────────────────────────────────────
ETH_RPC_URL=your_eth_rpc_url
```

> ⚠️ Never commit your `.env` file to version control. The `.gitignore` already excludes it by default.

---

## 🗺️ Roadmap

The following features are planned for upcoming releases:

- [ ] **Additional chain support** — Solana, Base, and more
- [ ] **Token-gated communities** — restrict access to posts or channels by token/NFT ownership
- [ ] **ENS & Stellar Federation** — display human-readable on-chain identities
- [ ] **Reputation system** — on-chain contribution scoring for builders
- [ ] **Mobile app** — React Native client for iOS and Android
- [ ] **Decentralized storage** — IPFS-backed media uploads

---

## 🤝 Contributing

ChainBoard is built in the open, for the community. All contributions are welcome — from bug fixes and documentation improvements to new features and chain integrations.

### Contribution Workflow

1. **Fork** the repository on GitHub
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes using conventional commits: `git commit -m "feat: add your feature"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open** a Pull Request against the `main` branch

### Guidelines

- Follow the existing code style and conventions
- Write tests for new functionality where applicable
- Keep PRs focused — one feature or fix per PR
- Link any related issues in your PR description

### Good First Issues

New to the codebase? Check out issues tagged [`good first issue`](https://github.com/chainboard-app/chainboard/issues?q=is%3Aissue+label%3A%22good+first+issue%22) — these are scoped, well-documented tasks ideal for getting started.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 👥 Maintainers

ChainBoard is actively maintained by its founding team. We are committed to reviewing PRs promptly, triaging issues, keeping dependencies up to date, and supporting contributors throughout the development process.

If you'd like to become a maintainer, start by contributing regularly and engaging with the community.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

## 🌍 Community

- 🐦 Twitter/X: *coming soon*
- 💬 Discord: *coming soon*
- 📖 Documentation: *coming soon*

---

## 🙏 Acknowledgements

Built with love for the Stellar and Ethereum developer communities.

Supported by [GrantFox](https://grantfox.xyz) — an open-source grants platform empowering builders worldwide.

Made with ❤️ by the ChainBoard team.
