# 💸 DeLoan — Decentralized Micro-Credit Platform

DeLoan is a decentralized micro-lending protocol that enables underbanked individuals to access **collateral-free loans** using a **reputation-based lending system**, powered by smart contracts. The protocol incentivizes repayment and provides risk-managed access to capital for people around the world.

---

## 🚀 Features

- 📈 **Reputation-based Lending:** Borrowers build on-chain credit scores through timely repayments.
- 🌐 **Global Liquidity Pools:** Lenders fund regional or thematic pools and earn yield.
- 🔐 **Non-custodial & Transparent:** All funds and decisions are governed by smart contracts.
- 🧑‍⚖️ **DAO Governance:** Community moderates disputes and adjusts system parameters.

---

## 🧩 Smart Contracts Overview

### 1. **LoanContract.sol**
Handles:
- Loan creation, approval, and repayment logic.
- Emitting events on loan status changes.
- Enforcing penalties and due dates.

### 2. **ReputationScore.sol**
Manages:
- Assigning reputation scores to addresses.
- Increasing score for timely repayments.
- Penalizing for missed deadlines or defaults.

### 3. **LiquidityPool.sol**
Controls:
- Deposits and withdrawals from lenders.
- Funding eligible loans based on pool parameters.
- Distributing repayments proportionally.

---

## 🛠️ Tech Stack

- **Solidity** — Smart contract language
- **Hardhat** — Development framework
- **Ethers.js** — Blockchain interaction
- **IPFS / Filecoin** — Optional storage for loan metadata
- **Polygon / Optimism** — Cost-effective L2 deployment
- **Next.js / React** — Frontend interface

---

## 📦 Installation

```bash
git clone https://github.com/yourorg/deloan.git
cd deloan
npm install
