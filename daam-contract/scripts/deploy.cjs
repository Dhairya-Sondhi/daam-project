const hre = require("hardhat");

async function main() {
  // This is the modern way to deploy a contract in Hardhat
  const vault = await hre.ethers.deployContract("DAAMVault");

  // This is the new function to wait for the contract to be mined
  await vault.waitForDeployment();

  // The contract address is now accessed via the 'target' property
  console.log(
    `DAAMVault deployed to: ${vault.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});