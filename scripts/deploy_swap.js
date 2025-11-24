const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying Swap contract with:', deployer.address);

  const TokenSwap = await hre.ethers.getContractFactory('TokenSwap');

  const tokenSwap = await TokenSwap.deploy();
  await tokenSwap.waitForDeployment();

  console.log('TokenSwap deployed at:', await tokenSwap.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
