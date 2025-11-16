const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const adminAddress = "0xa2525317402889d48AF009E1ae4E5a8baAa6e11c";
  const testAddress = "0x9516494976a6de49218b86c96cceac7eb0366de6610d068e861b3636beec1915";
  const supraToken = "0x..."; // Supra token
  const memecoins = ["0x...DOGE", "0x...SHIB", "0x...PEPE"];
  const supraOracle = "0x...";
  const supraDVRF = "0x...";
  const supraNova = "0x...";
  const supraAIAgent = "0x...";
  const supraAutoFi = "0x...";
  const treasury = adminAddress;

  const MEPLToken = await ethers.getContractFactory("MEPLToken");
  const meplToken = await MEPLToken.deploy(adminAddress);
  await meplToken.deployed();
  console.log("MEPLToken:", meplToken.address);

  const MemeVaultPool = await ethers.getContractFactory("MemeVaultPool");
  const pool = await MemeVaultPool.deploy(supraToken, memecoins, supraOracle, treasury, adminAddress);
  await pool.deployed();
  console.log("MemeVaultPool:", pool.address);

  const StakingVault = await ethers.getContractFactory("StakingVault");
  const staking = await StakingVault.deploy(supraToken, pool.address, meplToken.address, supraDVRF, adminAddress);
  await staking.deployed();
  console.log("StakingVault:", staking.address);

  const MemeIndexToken = await ethers.getContractFactory("MemeIndexToken");
  const index = await MemeIndexToken.deploy(pool.address);
  await index.deployed();
  console.log("MemeIndexToken:", index.address);

  const MemeVaultGovernor = await ethers.getContractFactory("MemeVaultGovernor");
  const governor = await MemeVaultGovernor.deploy(meplToken.address);
  await governor.deployed();
  console.log("MemeVaultGovernor:", governor.address);

  const AutoFiRebalancer = await ethers.getContractFactory("AutoFiRebalancer");
  const rebalancer = await AutoFiRebalancer.deploy(pool.address, supraOracle, supraAIAgent);
  await rebalancer.deployed();
  console.log("AutoFiRebalancer:", rebalancer.address);

  const AutoFiFeeAdjuster = await ethers.getContractFactory("AutoFiFeeAdjuster");
  const feeAdjuster = await AutoFiFeeAdjuster.deploy(pool.address);
  await feeAdjuster.deployed();
  console.log("AutoFiFeeAdjuster:", feeAdjuster.address);

  const AutoFiYieldHarvester = await ethers.getContractFactory("AutoFiYieldHarvester");
  const yieldHarvester = await AutoFiYieldHarvester.deploy(pool.address, supraNova, "0x...Aave");
  await yieldHarvester.deployed();
  console.log("AutoFiYieldHarvester:", yieldHarvester.address);

  const AutoFiMissions = await ethers.getContractFactory("AutoFiMissions");
  const missions = await AutoFiMissions.deploy(staking.address, meplToken.address, supraDVRF, supraOracle);
  await missions.deployed();
  console.log("AutoFiMissions:", missions.address);

  const AutoFiBurnScheduler = await ethers.getContractFactory("AutoFiBurnScheduler");
  const burnScheduler = await AutoFiBurnScheduler.deploy(meplToken.address, supraAutoFi);
  await burnScheduler.deployed();
  console.log("AutoFiBurnScheduler:", burnScheduler.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});