# ChainBoard

> A feed-style Web3 discussion platform for multi-chain communities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Chains](https://img.shields.io/badge/chains-Stellar%20%7C%20Ethereum-purple)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## What is ChainBoard?

ChainBoard is an open-source, feed-style discussion platform built for Web3 communities. It lets developers, builders, and blockchain enthusiasts across different chains — starting with **Stellar** and **Ethereum** — share ideas, discuss projects, ask questions, and reward great content with crypto tips.

---

## Features

- **Feed-style posts** — share thoughts, updates, and questions in a familiar format
- **Multi-chain support** — Stellar and Ethereum to start, with more chains coming
- **Dual authentication** — sign in with GitHub OAuth or your Web3 wallet (Freighter / MetaMask)
- **On-chain tipping** — reward great posts with USDC directly on-chain
- **Upvote system** — community-driven content ranking
- **Chain tags** — filter and discover content by blockchain ecosystem
- **Builder profiles** — showcase your projects, contributions, and on-chain activity
- **Notifications** — stay updated on replies, tips, and mentions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, TailwindCSS |
| Backend | NestJS, TypeORM, PostgreSQL |
| Smart Contracts | Soroban (Stellar), Solidity (Ethereum) |
| Auth | GitHub OAuth, Freighter Wallet, MetaMask |
| Payments | Stellar USDC, ERC-20 USDC |

---

## Project Structure

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
│   │   ├── entities/      # TypeORM entities (User, Post, Tip)
│   │   ├── migrations/    # Database migrations
│   │   ├── data-source.ts # TypeORM CLI data source config
│   │   ├── app.module.ts  # Main NestJS module
│   │   └── main.ts        # Application entry point
│   ├── test/              # E2E tests
│   └── .env.example       # Environment variable template
├── contracts/         # Smart contracts
│   ├── stellar/       # Soroban contracts
│   └── ethereum/      # Solidity contracts
└── docs/              # Documentation
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm
- PostgreSQL

### Installation

```bash
git clone https://github.com/chainboard-app/chainboard.git
cd chainboard

pnpm install
```

### Environment Setup

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=chainboard
```

### Database Setup

Create the PostgreSQL database:

```bash
createdb chainboard
```

### Running Migrations

```bash
cd backend
pnpm migration:run
```

To revert the last migration:

```bash
pnpm migration:revert
```

To generate a new migration after entity changes:

```bash
pnpm migration:generate src/migrations/MigrationName
```

### Running the Application

```bash
cd backend
pnpm start:dev
```

The API server starts on `http://localhost:3000`.

### Running Tests

Unit tests (uses SQLite in-memory, no PostgreSQL required):

```bash
cd backend
pnpm test
```

E2E tests (uses SQLite in-memory, no PostgreSQL required):

```bash
pnpm test:e2e
```

### Building

```bash
cd backend
pnpm build
```

---

## Database Schema

### User
- `id` (UUID, primary key)
- `githubId` (string, unique)
- `username` (string)
- `avatarUrl` (string, nullable)
- `walletAddress` (string, nullable)
- `createdAt` (timestamp)

### Post
- `id` (UUID, primary key)
- `content` (text)
- `chainTag` (string)
- `upvotes` (integer, default 0)
- `authorId` (UUID, foreign key to User)
- `createdAt` (timestamp)

### Tip
- `id` (UUID, primary key)
- `amount` (decimal)
- `senderId` (UUID, foreign key to User)
- `receiverId` (UUID, foreign key to User)
- `postId` (UUID, foreign key to Post)
- `txHash` (string)
- `createdAt` (timestamp)

---

## Contributing

We welcome contributions of all kinds! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with love by the ChainBoard team</p>
