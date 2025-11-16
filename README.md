# MemeVault Protocol

![MemeVault Logo](https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=MemeVault) <!-- Replace with actual logo URL -->

**MemeVault** is a decentralized finance (DeFi) platform built on the **Supra blockchain**, designed to aggregate staking for 2-4 memecoins (e.g., DOGE, SHIB, PEPE) and the native $SUPRA token in a weighted liquidity pool. It issues a liquid staking token (**stMEME**) that can be staked with $SUPRA to earn Supra network fees and governance token (**$MEPL**) rewards. The protocol leverages Supra’s **Proof of Efficient Liquidity (PoEL)**, **AutoFi** automation, **HyperNova** cross-chain interoperability, and native oracles to optimize yields, minimize impermanent loss (IL), and engage memecoin communities.

The $MEPL token has a **2 billion total supply** and a **12% monthly burn** that **stops after 2 years**, driving governance and incentivizing participation.

## Table of Contents
- [Protocol Overview](#protocol-overview)
- [Detailed Mechanics](#detailed-mechanics)
- [Tokenomics](#tokenomics)
- [Sustainability Strategies](#sustainability-strategies)
- [Profitability for Stakeholders](#profitability-for-stakeholders)
- [Supra Integration](#supra-integration)
- [DApp User Experience](#dapp-user-experience)
- [Implementation Roadmap](#implementation-roadmap)
- [Core Components](#core-components)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Protocol Overview
MemeVault is a staking aggregator and yield optimizer (not a traditional DEX) that combines memecoin liquidity with $SUPRA in a weighted pool (e.g., 70% $SUPRA, 30% memecoins). It issues **stMEME** tokens, which represent users’ shares in the pool and can be staked for additional rewards. The protocol uses Supra’s infrastructure to automate tasks, harvest cross-chain yields, and introduce features like community-driven memecoin curation, a tradable **MEME-INDEX** token, AI-driven yield optimization, gamified staking missions, and social sentiment-based reward boosts.

### Objectives
- **Sustainability**: Align incentives for liquidity providers, stakers, and the protocol treasury through diversified revenue streams and a deflationary $MEPL token.
- **Profitability**: Maximize returns via dynamic trading fees, Supra network fee sharing, cross-chain yields, and AI-driven optimization.
- **Community Engagement**: Attract memecoin communities with gamified missions, governance, and social sentiment boosts.
- **Innovation**: Differentiate from existing DeFi protocols with unique features tailored to memecoin enthusiasts.

## Core Components
| Component | Description | File |
|-----------|-------------|------|
| Liquidity Pool | Aggregates $SUPRA and memecoins, issuing stMEME tokens. | `MemeVaultPool.sol` |
| Staking Vault | Allows staking of stMEME and $SUPRA for network fees and $MEPL rewards. | `StakingVault.sol` |
| $MEPL Governance Token | 2 billion supply with 12% monthly burn for 2 years, used for governance and rewards. | `MEPLToken.sol` |
| MEME-INDEX Token | Tradable token tracking the pool’s memecoin basket. | `MemeIndexToken.sol` |
| AutoFi Rebalancing | Adjusts pool weights based on volatility. | `AutoFiRebalancer.sol` |
| AutoFi Dynamic Fees | Adjusts trading fees (0.1-1%) based on volume. | `AutoFiFeeAdjuster.sol` |
| AutoFi Cross-Chain Yields | Harvests yields from external chains via HyperNova. | `AutoFiYieldHarvester.sol` |
| AutoFi Gamified Missions | Manages staking missions and sentiment boosts. | `AutoFiMissions.sol` |
| Governance | Enables $MEPL holders to vote on memecoin curation. | `MemeVaultGovernor.sol` |
| DApp Frontend | React-based UI for interaction. | `/frontend/src/` |

## Detailed Mechanics
### A. Liquidity Pool (`MemeVaultPool.sol`)
- **Deposits**: Users provide weighted amounts (e.g., $700 $SUPRA + $100 each memecoin for $1,000 deposit). Receive proportional stMEME.
- **Withdrawals**: Burn stMEME to redeem assets.
- **Fees**: 0.1-1% on swaps; 70% to LPs, 20% to stakers, 10% to treasury.
- **Weights**: Initial 70% $SUPRA / 30% memecoins; auto-adjusted via `AutoFiRebalancer`.

### B. Staking Vault (`StakingVault.sol`)
- **Staking**: Stake stMEME/$SUPRA for 50% $SUPRA + 50% $MEPL rewards from network fees.
- **Rewards**: E.g., $1M staked pool earns $1,000 daily fees → $500 $SUPRA + $500 $MEPL distributed.

### C. $MEPL Governance Token (`MEPLToken.sol`)
- **Supply**: 2B total.
- **Distribution**:
  - 40% (800M): Liquidity incentives/airdrops.
  - 30% (600M): Treasury.
  - 20% (400M): Team/advisors (3-year vest).
  - 10% (200M): Community missions.
- **Burn**: 12% of circulating supply monthly for 24 months → ~47.57M circulating post-burn (from 1B initial).

### D. MEME-INDEX Token (`MemeIndexToken.sol`)
- Minted on deposit, burned on withdrawal; tradable on Supra DEXs.

### E. AutoFi Automation
- **Rebalancing**: Adjusts for >10% volatility (e.g., PEPE surge saves $15K IL in $1M pool).
- **Dynamic Fees**: Volume-based (e.g., $3M volume → 1% fee = $30K collected).
- **Cross-Chain Yields**: Deploys to Aave via HyperNova (e.g., $50K SHIB → $7.5K/year).
- **Missions**: Tasks like "stake $1K for 30 days" → $MEPL rewards + sentiment boosts (1.5x for trending coins).

### F. Governance (`MemeVaultGovernor.sol`)
- Proposals need 1M $MEPL; 7-day voting (e.g., add FLOKI → +$600K TVL).

### G. Innovative Features
- Community curation, MEME-INDEX, AI optimization, gamified missions, sentiment boosts.

## Tokenomics
- **$MEPL Burn Calculation**: \( S_{24} = 1,000,000,000 \times (0.88)^{24} \approx 47,573,000 \) (circulating).
- **Revenue Streams**:
  - Trading Fees: 0.1-1% on swaps.
  - Network Fees: 10-20% of Supra fees.
  - Cross-Chain Yields: 10-15% APY.
- **Projections ($1M TVL)**: LPs: $766.5K/year; Stakers: $474.5K/year; Treasury: $109.5K/year.

## Sustainability Strategies
- PoEL for capital efficiency (5-10% APY + fees).
- Deflationary $MEPL for scarcity.
- Diversified revenue + IL protection from treasury.

## Profitability for Stakeholders
| Stakeholder | Annual Earnings on $10K Stake |
|-------------|-------------------------------|
| Liquidity Providers | $210-500 (fees + APY) + $100 $MEPL airdrops |
| Stakers | $100-200 fees + $70 yields + $50 $MEPL |
| Treasury | $109.5K (development, marketing, IL) |

## Supra Integration
- **PoEL**: Dual staking/liquidity for $SUPRA.
- **AutoFi**: On-chain automation for primitives like liquidations.
- **HyperNova**: Bridgeless cross-chain (e.g., ETH to Aptos/Sui).
- **Oracles**: Sub-3s real-time data for prices/sentiment.

## DApp User Experience
- **Home**: TVL, $MEPL supply, burn countdown.
- **Pool**: Deposit/withdraw, MEME-INDEX info.
- **Staking**: Stake/claim, missions.
- **Governance**: Proposals/voting.
- Memecoin-themed UI with vibrant visuals.

## Implementation Roadmap
1. **Research (1-2 months)**: Study Supra AutoFi/oracles/HyperNova.
2. **Development (4-6 months)**: Deploy contracts + DApp; integrate StarKey wallet.
3. **Testing (2 months)**: Hardhat/Jest on Supra Starcade testnet.
4. **Launch (2-3 months)**: Mainnet deploy, airdrops, X promotion.
5. **Expansion**: Add memecoins/chains.

## Getting Started
### Prerequisites
- Node.js (v18+)
- Hardhat for Solidity
- React for frontend
- Supra RPC: `https://rpc-evmstaging.supra.com/rpc/v1/eth` (testnet)

### Installation
1. Clone repo: `git clone <your-repo-url>`
2. Install dependencies:
   - Backend: `cd contracts && npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox`
   - Frontend: `cd frontend && npm install`
3. Compile contracts: `npx hardhat compile`
4. Run tests: `npx hardhat test`

### Development
- Start frontend: `cd frontend && npm start` (runs on http://localhost:3000)
- Deploy contracts: See [Deployment](#deployment)

## Deployment
1. Configure `hardhat.config.js` with Supra RPC and private key.
2. Deploy: `npx hardhat run scripts/deploy.js --network supraTestnet`
3. Verify on Supra explorer (TBD; use EVM-compatible tools).
4. Frontend: Build with `npm run build` and host on Vercel/Netlify.

For full smart contract code, see `/contracts/src/`. Example `MemeVaultPool.sol` skeleton:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MemeVaultPool {
    IERC20 public supraToken;
    IERC20 public stMEMEToken;
    // Add memecoin tokens...

    function deposit(uint256 supraAmount, uint256[] calldata memecoinAmounts) external {
        // Approval + transfer logic + mint stMEME
    }

    function withdraw(uint256 stMEMEAmount) external {
        // Burn stMEME + redeem assets
    }
}