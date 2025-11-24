const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with address:', deployer.address);

  // Deploy FakeUSDT
  const FakeUSDT = await hre.ethers.getContractFactory('FakeUSDT');
  const fakeUSDT = await FakeUSDT.deploy();
  await fakeUSDT.waitForDeployment();
  console.log('FakeUSDT deployed at:', await fakeUSDT.getAddress());

  // Deploy FakeUSDC
  const FakeUSDC = await hre.ethers.getContractFactory('FakeUSDC');
  const fakeUSDC = await FakeUSDC.deploy();
  await fakeUSDC.waitForDeployment();
  console.log('FakeUSDC deployed at:', await fakeUSDC.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
