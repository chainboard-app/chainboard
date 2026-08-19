# ⛓️ ChainBoard

> A feed-style Web3 discussion and tipping platform for multi-chain developer communities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Chains](https://img.shields.io/badge/chains-Stellar%20%7C%20Ethereum%20%7C%20Polygon%20%7C%20Solana-purple)
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

ChainBoard currently supports the **Stellar**, **Ethereum**, **Polygon**, and **Solana** ecosystems, with a modular architecture designed to expand to additional chains over time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🐦 Feed-style posts | Share thoughts, updates, and questions in a familiar social format |
| 🔗 Multi-chain support | Stellar, Ethereum, Polygon, and Solana with modular architecture for expansion |
| 🔐 Dual authentication | Sign in via GitHub OAuth or a Web3 wallet (Freighter / MetaMask / Phantom) |
| 💸 On-chain tipping | Reward great posts with USDC directly on-chain — no intermediaries |
| 🗳️ Upvote system | Community-driven content ranking to surface the best discussions |
| 🏷️ Chain tags | Filter and discover content by blockchain ecosystem |
| 👤 Builder profiles | Showcase projects, contributions, and on-chain activity |
| 🔔 Notifications | Real-time updates on replies, tips, and mentions |
| 💬 Messaging | Direct messaging between users for private conversations |
| 👥 Communities | Create and join topic-based communities for focused discussions |
| 🤝 Follow system | Follow other builders to stay updated on their activity |
| 🎨 NFT management | Display and manage NFT collections across supported chains |
| 📊 Reputation system | On-chain contribution scoring for builders |
| 📚 Content series | Organize related posts into series for structured content |
| 🔍 Wallet activity | Track and display on-chain wallet activity and transaction history |
| 🛡️ Moderation tools | Content moderation and community management features |
| ⚡ Real-time updates | WebSocket support for live feed and notification updates |
| 📈 Analytics dashboard | Track engagement metrics and community growth |
| 🏆 Leaderboard | Display top contributors and most active community members |
| 💾 Tip history | View complete history of sent and received tips |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, TailwindCSS, Vite, React Router |
| Backend | NestJS, PostgreSQL, TypeORM |
| Blockchain SDKs | Stellar SDK, Solana Web3.js, Ethers.js |
| Authentication | GitHub OAuth, Freighter Wallet, MetaMask, Phantom |
| Real-time | Socket.io, WebSockets |
| Job Queues | BullMQ, Redis |
| Logging | Winston, Winston Daily Rotate File |
| API Documentation | Swagger/OpenAPI |
| Health Monitoring | NestJS Terminus |
| Task Scheduling | NestJS Schedule |
| Rate Limiting | NestJS Throttler |
| Caching | Cache Manager |
| Payments | Stellar USDC, ERC-20 USDC, SPL tokens |

---

## 🏗️ Architecture

ChainBoard is structured as a monorepo with three distinct layers:

- **Frontend** — A React + TypeScript SPA that communicates with the backend REST API and WebSocket server, and interfaces with wallet extensions directly from the browser.
- **Backend** — A NestJS service responsible for user management, post storage, authentication, and bridging between the frontend and the blockchain. Includes:
  - REST API for standard CRUD operations
  - WebSocket server for real-time updates
  - Job queues (BullMQ) for background processing
  - Comprehensive logging (Winston)
  - Health monitoring (Terminus)
  - Rate limiting and caching
- **Blockchain Integration** — Modular services for Stellar, Ethereum, Polygon, and Solana that handle wallet connections, transaction signing, and on-chain interactions.

---

## 📁 Project Structure

```
chainboard/
├── frontend/              # React + TypeScript UI
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Route-level page components
│       │   ├── AnalyticsDashboard/
│       │   ├── Feed/
│       │   ├── Leaderboard/
│       │   ├── Messages/
│       │   ├── ModerationDashboard/
│       │   ├── TipHistory/
│       │   └── UserProfile/
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # External library configurations
│       ├── types/         # TypeScript type definitions
│       └── utils/         # Helper functions and constants
│
├── backend/               # NestJS REST API
│   └── src/
│       ├── auth/          # GitHub OAuth + wallet authentication
│       ├── blockchains/   # Multi-chain integration services
│       │   ├── polygon/
│       │   └── solana/
│       ├── communities/   # Community management
│       ├── common/        # Shared infrastructure
│       │   ├── cache/     # Caching configuration
│       │   ├── config/    # Configuration management
│       │   ├── decorators/# Custom decorators
│       │   ├── filters/   # Exception filters
│       │   ├── guards/    # Route guards
│       │   ├── health/    # Health checks
│       │   ├── integrations/# Third-party integrations
│       │   ├── interceptors/# Request/response interceptors
│       │   ├── logger/    # Winston logging
│       │   ├── middleware/# Custom middleware
│       │   ├── monitoring/# Metrics and monitoring
│       │   ├── queues/    # BullMQ job queues
│       │   ├── services/  # Shared services
│       │   ├── utils/     # Utility functions
│       │   └── validation/# Request validation
│       ├── follows/       # User follow system
│       ├── messages/      # Direct messaging
│       ├── moderation/    # Content moderation
│       ├── nfts/          # NFT management
│       ├── notifications/ # Notification service
│       ├── posts/         # Post creation, retrieval, and upvotes
│       ├── reputation/    # Reputation scoring
│       ├── series/        # Content series
│       ├── stellar/       # Stellar-specific services
│       ├── tips/          # On-chain tipping integration
│       ├── users/         # User profiles and settings
│       ├── wallet-activity/# Wallet activity tracking
│       └── websocket/     # WebSocket gateway
│
├── kubernetes/            # Kubernetes deployment configurations
│   └── backend-deployment.yaml
│
├── scripts/               # Utility scripts
│   ├── backup.ps1         # Windows backup script
│   ├── backup.sh          # Linux/Mac backup script
│   ├── restore.ps1        # Windows restore script
│   └── restore.sh         # Linux/Mac restore script
│
├── .env.example           # Environment variables template
├── docker-compose.yml     # Docker development setup
├── Dockerfile             # Production Docker image
└── package.json           # Root package.json (monorepo)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your system before proceeding:

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/) (for BullMQ job queues)
- [Freighter Wallet](https://www.freighter.app/) (for Stellar features)
- [MetaMask](https://metamask.io/) (for Ethereum and Polygon features)
- [Phantom Wallet](https://phantom.app/) (for Solana features)

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

# ─── Redis ──────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── Authentication ─────────────────────────────────────────
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret

# ─── Stellar ────────────────────────────────────────────────
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# ─── Ethereum ───────────────────────────────────────────────
ETH_RPC_URL=your_eth_rpc_url

# ─── Polygon ───────────────────────────────────────────────
POLYGON_RPC_URL=your_polygon_rpc_url

# ─── Solana ────────────────────────────────────────────────
SOLANA_RPC_URL=https://api.devnet.solana.com
```

> ⚠️ Never commit your `.env` file to version control. The `.gitignore` already excludes it by default.

---

## ☸️ Kubernetes Deployment

ChainBoard includes Kubernetes configurations for production deployment.

### Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured for your cluster
- Docker registry access for pushing images

### Deployment Steps

```bash
# 1. Build and push Docker images
docker build -t chainboard/backend:latest .
docker push chainboard/backend:latest

# 2. Create Kubernetes secrets
kubectl create secret generic chainboard-secrets \
  --from-literal=database-url="postgresql://user:password@host:5432/chainboard" \
  --from-literal=jwt-secret="your_jwt_secret" \
  --from-literal=redis-url="redis://host:6379"

# 3. Apply the deployment configuration
kubectl apply -f kubernetes/backend-deployment.yaml

# 4. Verify the deployment
kubectl get deployments
kubectl get pods
kubectl get services
```

### Configuration

The Kubernetes deployment includes:

- **Replicas**: 3 pods for high availability
- **Resources**: Configured with requests (256Mi RAM, 250m CPU) and limits (512Mi RAM, 500m CPU)
- **Health Checks**: Liveness and readiness probes configured
- **Service**: ClusterIP service exposing port 4000 internally

### Scaling

To scale the deployment:

```bash
kubectl scale deployment chainboard-backend --replicas=5
```

---

## 💾 Backup & Restore

ChainBoard includes utility scripts for database backup and restoration.

### Backup

#### Linux/Mac

```bash
./scripts/backup.sh
```

#### Windows (PowerShell)

```powershell
.\scripts\backup.ps1
```

The backup script will:
- Create a timestamped backup of the PostgreSQL database
- Store backups in the `backups/` directory
- Compress the backup file to save space
- Keep the last 7 days of backups by default

### Restore

#### Linux/Mac

```bash
./scripts/restore.sh <backup-file>
```

#### Windows (PowerShell)

```powershell
.\scripts\restore.ps1 <backup-file>
```

The restore script will:
- Validate the backup file integrity
- Drop and recreate the database
- Restore data from the backup file
- Run any pending migrations

### Configuration

Backup behavior can be configured by modifying the script variables:
- `BACKUP_DIR`: Directory where backups are stored (default: `./backups`)
- `RETENTION_DAYS`: Number of days to keep backups (default: 7)
- `DB_NAME`: Database name (default: `chainboard`)

### Automated Backups

For production environments, consider setting up automated backups using cron:

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/chainboard/scripts/backup.sh
```

---

## 🗺️ Roadmap

The following features are planned for upcoming releases:

- [ ] **Additional chain support** — Base, Arbitrum, Optimism, and more
- [ ] **Token-gated communities** — restrict access to posts or channels by token/NFT ownership
- [ ] **ENS & Stellar Federation** — display human-readable on-chain identities
- [ ] **Mobile app** — React Native client for iOS and Android
- [ ] **Decentralized storage** — IPFS-backed media uploads
- [ ] **Advanced analytics** — Enhanced community insights and engagement metrics
- [ ] **Multi-language support** — Internationalization for global communities

---

## ⭐ Stellar Integration

ChainBoard provides comprehensive Stellar blockchain integration, enabling developers to interact with the Stellar network for tipping, NFT management, and smart contract interactions.

### Features

- **Account Management**: Create, fund, and manage Stellar accounts
- **Transaction Operations**: Send payments, manage assets, and submit transactions
- **Soroban Smart Contracts**: Deploy and invoke Soroban contracts
- **Federation Support**: Resolve Stellar federation addresses (e.g., `user*stellar.org`)
- **Asset Management**: Handle custom assets and NFTs on Stellar
- **Wallet Connection**: Seamless wallet integration for client-side signing
- **Memo Support**: Full SEP-0005 memo standard implementation

### API Endpoints

#### Account Operations
- `POST /stellar/keypair` - Generate a new Stellar keypair
- `POST /stellar/fund/:publicKey` - Fund a testnet account (friendbot)
- `GET /stellar/account/:publicKey` - Get account information
- `GET /stellar/account/:publicKey/balances` - Get account balances
- `GET /stellar/account/:publicKey/transactions` - Get transaction history

#### Transactions
- `POST /stellar/payment` - Create a payment transaction
- `POST /stellar/transaction/submit` - Submit a signed transaction

#### Assets & Federation
- `GET /stellar/federation/:address` - Resolve a federation address
- `GET /stellar/asset/:code/:issuer` - Get asset metadata

#### Soroban Contracts
- `POST /stellar/contract/deploy` - Deploy a Soroban contract
- `POST /stellar/contract/invoke` - Invoke a contract method

#### Network
- `GET /stellar/network` - Get network information

### Configuration

Configure Stellar integration in your `.env` file:

```env
# Stellar Network Configuration
STELLAR_NETWORK=testnet  # or 'mainnet'
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_FRIENDBOT_URL=https://friendbot.stellar.org
```

### Usage Examples

#### Create and Fund an Account

```typescript
// Generate keypair
const { publicKey, secretKey } = await stellarService.createKeypair();

// Fund on testnet
await stellarService.fundTestnetAccount(publicKey);
```

#### Send a Payment

```typescript
// Create payment transaction
const xdr = await stellarService.createPaymentTransaction({
  fromSecret: 'S...',
  toPublicKey: 'G...',
  amount: '10',
  assetCode: 'XLM',
});

// Submit transaction
const result = await stellarService.submitTransaction(xdr);
```

#### Deploy a Soroban Contract

```typescript
const { contractId, transactionHash } = await stellarService.deployContract(
  sourceSecret,
  wasmBuffer,
);
```

#### Resolve Federation Address

```typescript
const accountId = await stellarService.resolveFederationAddress('user*stellar.org');
```

### Stellar Standards Supported

- **SEP-0005**: Memo format for transactions
- **SEP-0001**: Stellar account requirements
- **SEP-0002**: Federation protocol
- **SEP-0024**: Soroban smart contract interface

### Testing on Testnet

ChainBoard defaults to Stellar testnet for development. Use the friendbot endpoint to fund test accounts:

```bash
curl -X POST http://localhost:4000/stellar/fund/GPUBLICKEY
```

### Mainnet Deployment

For production, update your environment variables:

```env
STELLAR_NETWORK=mainnet
STELLAR_RPC_URL=https://soroban.stellar.org
STELLAR_HORIZON_URL=https://horizon.stellar.org
```

**Important**: Never expose secret keys on mainnet. Use proper key management and hardware wallets for production.

---

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Errors

**Problem**: `Connection refused` or `ECONNREFUSED` when starting the backend

**Solutions**:
- Ensure PostgreSQL is running: `pg_isready` or check your PostgreSQL service
- Verify `DATABASE_URL` in `.env` matches your PostgreSQL configuration
- Check that the database exists: `createdb chainboard` if needed
- Ensure the user in the connection string has proper permissions

#### Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::3000` or `:::4000`

**Solutions**:
- Change the port in `.env` by setting `PORT=3001` (backend) or adjusting frontend port
- Kill the process using the port:
  - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:3000 | xargs kill -9`

#### Dependency Installation Issues

**Problem**: `pnpm install` fails with peer dependency warnings

**Solutions**:
- Run `pnpm install --force` to bypass peer dependency checks
- Update Node.js to version 20 or higher
- Clear pnpm cache: `pnpm store prune`

#### Build Errors

**Problem**: TypeScript compilation errors or build failures

**Solutions**:
- Ensure all dependencies are installed: `pnpm install`
- Check TypeScript version compatibility in `tsconfig.json`
- Run `pnpm run lint` to identify specific issues
- Clear build artifacts: `rm -rf backend/dist frontend/dist`

#### Wallet Connection Issues

**Problem**: Freighter/MetaMask wallet not connecting

**Solutions**:
- Ensure wallet extension is installed and unlocked
- Check that you're on the correct network (testnet for development)
- Clear browser cache and try again
- Check browser console for specific error messages

#### CORS Errors

**Problem**: Browser shows CORS policy errors in console

**Solutions**:
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Ensure backend CORS configuration includes your domain
- Check that the backend is running and accessible

### Performance Issues

#### Slow Database Queries

**Solutions**:
- Check database connection pool settings in `app.module.ts`
- Run `ANALYZE` on your PostgreSQL database
- Add indexes to frequently queried columns
- Monitor slow queries with PostgreSQL logging

#### High Memory Usage

**Solutions**:
- Adjust `DB_POOL_MAX` and `DB_POOL_SIZE` in environment variables
- Check for memory leaks in custom services
- Monitor with the `/metrics` endpoint
- Restart services periodically if needed

### Development Issues

#### Hot Module Replacement Not Working

**Solutions**:
- Ensure you're running `pnpm run dev` (not `pnpm run build`)
- Check that file watchers are working on your OS
- Try restarting the development server
- Check Vite configuration in `vite.config.ts`

#### Environment Variables Not Loading

**Solutions**:
- Ensure `.env` file exists in the project root
- Verify variable names match those in `.env.example`
- Restart the server after changing `.env`
- Check for typos in variable names

### Testing Issues

#### Tests Failing in CI but Not Locally

**Solutions**:
- Ensure database migrations are run in CI
- Check that test environment variables are set
- Verify time zone settings match between environments
- Check for race conditions in async tests

#### Coverage Reports Missing

**Solutions**:
- Ensure Jest is configured for coverage in `jest.config.js`
- Run tests with coverage: `pnpm run test:cov`
- Check that coverage directory is not in `.gitignore`

### Docker Issues

#### Container Won't Start

**Solutions**:
- Check Docker logs: `docker logs <container_id>`
- Ensure all required environment variables are set
- Verify network connectivity between containers
- Check that ports are not already in use

#### Build Fails in Docker

**Solutions**:
- Ensure Dockerfile uses correct Node.js version
- Check that `pnpm-lock.yaml` is committed
- Verify all dependencies are in `package.json`
- Try building with `--no-cache` flag

### Getting Help

If you encounter issues not covered here:

1. **Check the logs**: Backend logs are in `logs/` directory, frontend logs in browser console
2. **Search GitHub Issues**: Check if others have encountered similar issues
3. **Create a minimal reproduction**: Simplify your setup to isolate the problem
4. **Provide context**: Include error messages, environment details, and steps to reproduce
5. **Join the community**: Ask for help in Discord (coming soon)

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
