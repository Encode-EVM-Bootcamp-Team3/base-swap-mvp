// scripts/fundLiquidity.js
// Mints test liquidity into the TokenSwap contract on Sepolia.

const { ethers } = require('hardhat');

// Deployed addresses (Sepolia)
const SWAP = '0xB80609D89eFE4b3e1A0Ab91d6c16BB520B762256';
const FUSDT = '0x58d1fB5788283Bc6abb12cF958f56ABAAAf6CC7C';
const FUSDC = '0x51e78127EA289f36E39d6685bd7e59468814c813';

// Amount to mint to the swap contract (in whole tokens)
const AMOUNT_TOKENS = '1000'; // 1,000 tokens each
const DECIMALS = 6;

async function main() {
  const [signer] = await ethers.getSigners();
  console.log(`Funding from: ${signer.address}`);
  console.log(`Swap contract: ${SWAP}`);

  const usdt = await ethers.getContractAt('FakeUSDT', FUSDT, signer);
  const usdc = await ethers.getContractAt('FakeUSDC', FUSDC, signer);

  const amount = ethers.parseUnits(AMOUNT_TOKENS, DECIMALS);

  const beforeUsdt = await usdt.balanceOf(SWAP);
  const beforeUsdc = await usdc.balanceOf(SWAP);
  console.log(
    `Before -> FUSDT: ${ethers.formatUnits(beforeUsdt, DECIMALS)}, FUSDC: ${ethers.formatUnits(beforeUsdc, DECIMALS)}`,
  );

  const tx1 = await usdt.mint(SWAP, amount);
  await tx1.wait();
  console.log(`Minted FUSDT: ${AMOUNT_TOKENS} (raw: ${amount})`);

  const tx2 = await usdc.mint(SWAP, amount);
  await tx2.wait();
  console.log(`Minted FUSDC: ${AMOUNT_TOKENS} (raw: ${amount})`);

  const afterUsdt = await usdt.balanceOf(SWAP);
  const afterUsdc = await usdc.balanceOf(SWAP);
  console.log(
    `After  -> FUSDT: ${ethers.formatUnits(afterUsdt, DECIMALS)}, FUSDC: ${ethers.formatUnits(afterUsdc, DECIMALS)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
