# Swap DApp MVP - Base Sepolia Testnet

A minimal token swap decentralized application running on Base Sepolia Testnet. This project demonstrates a complete flow from frontend to backend to blockchain for executing token swaps.

## Project Overview

This DApp enables users to select two tokens (Token A and Token B), input an amount, and execute a real swap transaction on Base Sepolia testnet. The architecture follows a three-tier structure: Smart Contract, Backend API, and Frontend Interface.

## Technology Stack

| Component         | Technology                            |
| ----------------- | ------------------------------------- |
| Smart Contract    | Solidity ^0.8.20, Hardhat ^2.x        |
| Testing Framework | Mocha, Chai                           |
| Backend           | Node.js, Express, Ethers.js/Viem      |
| Frontend          | Next.js ^14, Wagmi ^2.x, Viem ^2.x    |
| Network           | Base Sepolia Testnet                  |
| RPC Provider      | Alchemy, Infura, or Base Official RPC |

## Project Structure

```
project-root/
├── contracts/
│   ├── TokenSwap.sol
│   ├── test/
│   │   └── TokenSwap.test.js
│   └── scripts/
│       └── deploy.js
├── backend/
│   ├── app.js
│   ├── routes/
│   │   └── swap.js
│   ├── services/
│   │   └── swapService.js
│   ├── utils/
│   │   └── provider.js
│   ├── abi/
│   │   └── TokenSwap.json
│   └── .env
├── frontend/
│   ├── pages/
│   │   ├── index.tsx
│   │   └── _app.tsx
│   ├── components/
│   │   └── SwapForm.tsx
│   ├── lib/
│   │   └── wagmiClient.ts
│   └── styles/
│       └── globals.css
└── hardhat.config.js
```

## Smart Contract Specification

### Core Functions

**constructor(address \_router)**

- Initializes the contract with the DEX router address

**swapExactInputSingle(address tokenIn, address tokenOut, uint256 amountIn)**

- Executes a single-path swap with exact input amount

**swapExactOutputSingle(address tokenIn, address tokenOut, uint256 amountOut)**

- Executes a single-path swap with exact output amount (optional for MVP)

**getEstimatedAmountOut(address tokenIn, address tokenOut, uint256 amountIn)**

- Returns estimated output amount for UI display (optional)

**withdrawToken(address token)**

- Admin function to recover stuck tokens

**receive() / fallback()**

- Handles ETH/WETH unwrapping if required (optional)

### Testing Requirements

The test suite should cover:

- Successful contract deployment
- Happy path for swapExactInputSingle
- Failure scenarios: insufficient allowance, invalid amounts, revert conditions
- Optional: Forked Base Sepolia integration tests


## Frontend Implementation

// TODO


## Backend Implementation
// TODO



## Base Sepolia Testnet Configuration

**RPC Endpoint:**

**Faucet:** https://bridge.base.org/testnet

To get started:

1. Configure MetaMask for Base Sepolia network
2. Obtain test ETH from the faucet
3. Deploy test ERC20 tokens if needed
4. Deploy the TokenSwap contract
5. Update contract addresses in environment configuration

## Integration Architecture

### Contract to Backend

- Solidity developer provides deployed contract address and ABI JSON
- Backend loads ABI and contract address to expose /swap endpoint
- Backend executes transactions on behalf of users or via relayer pattern

### Backend to Frontend

- Frontend sends POST request to /swap with parameters: tokenIn, tokenOut, amountInWei
- Backend responds with transaction hash or error message
- UI displays transaction status: pending, success, or failed

### Frontend to Contract (Alternative)

- Direct wallet interaction using Wagmi/Viem hooks
- User signs transactions directly through connected wallet
- Bypasses backend for fully decentralized flow

## Setup and Commands

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy to Base Sepolia

```bash
npx hardhat run contracts/scripts/deploy.js --network base-sepolia
```

### Run Tests

```bash
npx hardhat test
```

### Start Backend Server

```bash
cd backend
npm run dev
```

### Start Frontend Application

```bash
cd frontend
npm run dev
```

## Environment Configuration

Create a `.env` file in the backend directory:

```
RPC_URL=
PRIVATE_KEY=0xYOUR_TEST_WALLET_PRIVATE_KEY
CONTRACT_ADDRESS=0xDEPLOYED_CONTRACT_ADDRESS
PORT=3001
```

**Security Notice:** Use a dedicated test wallet only. Never commit private keys or .env files to version control.

## Development Timeline

|  **Week**  | **Focus**                          | **Description**                                                                                                                                                                                                                          |
| :--------: | :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Week 1** | Core System Setup & MVP Completion | Build the full project architecture — including smart contract, backend API, and basic frontend — to ensure the system runs end-to-end by **Sunday**. Prepare for the demo discussion and decide on potential new features to highlight. |
| **Week 2** | Feature Expansion & Enhancement    | Integrate and test new features discussed after the MVP demo. Improve UX/UI, add advanced swap logic or analytics, and refine overall stability and presentation for the final showcase.                                                 |

## Team Responsibilities

**Backend Developer**

- Implement Express API server
- Integrate contract interactions
- Handle transaction management

**Solidity Developer**

- Develop and test TokenSwap.sol
- Deploy contract to testnet
- Provide ABI and contract address

**Frontend Developer**

- Build Next.js user interface
- Implement wallet connection
- Integrate swap functionality

## Definition of Done

The MVP is considered complete when:

1. TokenSwap contract is deployed on Base Sepolia testnet
2. Backend /swap endpoint successfully executes swaps and returns transaction hashes
3. Frontend allows wallet connection, swap submission, and displays transaction results
4. End-to-end demo successfully demonstrates the complete swap flow

## License

This project is for educational and demonstration purposes.
