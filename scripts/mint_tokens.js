const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Minting from:', deployer.address);

  const usdtAddr = process.env.FAKE_USDT_ADDRESS;
  const usdcAddr = process.env.FAKE_USDC_ADDRESS;

  const FakeUSDT = await hre.ethers.getContractAt('FakeUSDT', usdtAddr);
  const FakeUSDC = await hre.ethers.getContractAt('FakeUSDC', usdcAddr);

  const amount = hre.ethers.parseUnits('1000', 6);

  console.log('Minting USDT...');
  await FakeUSDT.mint(deployer.address, amount);

  console.log('Minting USDC...');
  await FakeUSDC.mint(deployer.address, amount);

  console.log('Done!');
}

main().catch(console.error);
