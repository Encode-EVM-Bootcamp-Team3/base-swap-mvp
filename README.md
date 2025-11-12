# Swap DApp MVP – Base Sepolia Testnet

A minimal token swap decentralized application running on Base Sepolia Testnet.  
This MVP demonstrates a complete on-chain swap flow from frontend UI → smart contract interaction, using Wagmi + Viem for wallet connection and transaction execution.

---

## Project Overview

This DApp enables users to:

- Select two tokens (Token A & Token B)
- Input an amount to swap
- Execute a real on-chain transaction on Base Sepolia testnet

**No backend is required for the MVP** — data such as estimated output or swap status will be fetched directly from the smart contract via Viem.

---

## Technology Stack

| Component         | Technology                                     |
| ----------------- | ---------------------------------------------- |
| Smart Contract    | Solidity ^0.8.20, Hardhat ^2.x                 |
| Testing Framework | Mocha, Chai                                    |
| Frontend          | Next.js ^14, TypeScript, Wagmi ^2.x, Viem ^2.x |
| Network           | Base Sepolia Testnet                           |
| RPC Provider      | Alchemy, Infura, or Base Official RPC          |

---

## Project Structure

```
project-root/
├── contracts/
│   ├── TokenSwap.sol
│   ├── test/
│   │   └── TokenSwap.test.js
│   └── scripts/
│       └── deploy.js
├── frontend/
│   ├── pages/
│   │   ├── index.tsx          # main swap UI
│   │   └── _app.tsx
│   ├── components/
│   │   ├── SwapForm.tsx       # handles user input + swap trigger
│   │   ├── TokenSelector.tsx  # token dropdown component
│   │   └── TxStatus.tsx       # show pending/success/error
│   ├── lib/
│   │   ├── wagmiClient.ts     # wagmi + viem setup
│   │   ├── contract.ts        # contract address + ABI config
│   │   └── utils.ts           # helper (formatting, toast, etc.)
│   ├── styles/
│   │   └── globals.css
│   └── .env.local             # local environment variables
└── hardhat.config.js
```

---

## Smart Contract Specification

### TokenSwap.sol

// TODO

| Function                                                                      | Description                                              |
| ----------------------------------------------------------------------------- | -------------------------------------------------------- |
| `constructor(address _router)`                                                | Initializes contract with DEX router address             |
| `swapExactInputSingle(address tokenIn, address tokenOut, uint256 amountIn)`   | Executes a single-path swap                              |
| `swapExactOutputSingle(address tokenIn, address tokenOut, uint256 amountOut)` | Executes a swap targeting exact output amount (optional) |
| `getEstimatedAmountOut(...)`                                                  | Returns estimated output amount (optional)               |
| `withdrawToken(address token)`                                                | Admin recovery function                                  |
| `receive()` / `fallback()`                                                    | Handles ETH/WETH unwrap (optional)                       |

---

## Frontend

### Environment Variables (`.env.local`)

// TODO

### Wagmi + Viem Setup (`lib/wagmiClient.ts`)

// TODO

### Contract Configuration (`lib/contract.ts`)

// TODO

### Core Swap Logic (`components/SwapForm.tsx`)

// TODO

---

## Deployment & Commands

### Install dependencies

```bash
npm install
```

### Compile contracts

```bash
npx hardhat compile
```

### Deploy contract to Base Sepolia

```bash
npx hardhat run contracts/scripts/deploy.js --network base-sepolia
```

### Run frontend locally

```bash
cd frontend
npm run dev
```

Then open: http://localhost:3000

---

## Definition of Done

- [ ] TokenSwap.sol deployed on Base Sepolia Testnet
- [ ] Frontend successfully connects wallet via Wagmi/Viem
- [ ] User can select tokens, input amount, and call `swapExactInputSingle`
- [ ] UI displays transaction status (pending/success/fail)
- [ ] MVP demo shows a full on-chain swap without backend

---

## Development Timeline

| Week   | Focus             | Description                                          |
| ------ | ----------------- | ---------------------------------------------------- |
| Week 1 | Core System Setup | Build contract + frontend MVP (end-to-end swap flow) |
| Week 2 | Enhancement & UX  | UI polish, add token lists, optional quote display   |

---

## Team Responsibilities

| Role               | Tasks                                                 |
| ------------------ | ----------------------------------------------------- |
| Solidity Developer | Build and deploy TokenSwap.sol                        |
| Frontend Developer | Implement UI, wallet connection, and swap interaction |

---

## License

For educational and demonstration purposes only.
