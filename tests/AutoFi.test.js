const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutoFi", function () {
  let pool, rebalancer, feeAdjuster, yieldHarvester, missions, burnScheduler, supraToken, memecoins, supraOracle, supraDVRF, supraNova, supraAIAgent, supraAutoFi;
  const adminAddress = "0xa2525317402889d48AF009E1ae4E5a8baAa6e11c";
  const testAddress = "0x9516494976a6de49218b86c96cceac7eb0366de6610d068e861b3636beec1915";

  beforeEach(async function () {
    [admin] = await ethers.getSigners();
    const SupraToken = await ethers.getContractFactory("MockERC20");
    supraToken = await SupraToken.deploy("Supra", "SUPRA", ethers.utils.parseEther("1000000"));
    await supraToken.deployed();

    memecoins = [];
    for (let i = 0; i < 3; i++) {
      const memecoin = await SupraToken.deploy(`Memecoin${i}`, `MEME${i}`, ethers.utils.parseEther("1000000"));
      await memecoin.deployed();
      memecoins.push(memecoin.address);
    }

    const MockSupraOracle = await ethers.getContractFactory("MockSupraOracle");
    supraOracle = await MockSupraOracle.deploy();
    await supraOracle.deployed();

    const MockSupraDVRF = await ethers.getContractFactory("MockSupraDVRF");
    supraDVRF = await MockSupraDVRF.deploy();
    await supraDVRF.deployed();

    const MockSupraNova = await ethers.getContractFactory("MockSupraNova");
    supraNova = await MockSupraNova.deploy();
    await supraNova.deployed();

    const MockSupraAIAgent = await ethers.getContractFactory("MockSupraAIAgent");
    supraAIAgent = await MockSupraAIAgent.deploy();
    await supraAIAgent.deployed();

    const MockSupraAutoFi = await ethers.getContractFactory("MockSupraAutoFi");
    supraAutoFi = await MockSupraAutoFi.deploy();
    await supraAutoFi.deployed();

    const MemeVaultPool = await ethers.getContractFactory("MemeVaultPool");
    pool = await MemeVaultPool.deploy(supraToken.address, memecoins, supraOracle.address, adminAddress, adminAddress);
    await pool.deployed();

    const MEPLToken = await ethers.getContractFactory("MEPLToken");
    const meplToken = await MEPLToken.deploy(adminAddress);
    await meplToken.deployed();

    const StakingVault = await ethers.getContractFactory("StakingVault");
    const staking = await StakingVault.deploy(supraToken.address, pool.address, meplToken.address, supraDVRF.address, adminAddress);
    await staking.deployed();

    const AutoFiRebalancer = await ethers.getContractFactory("AutoFiRebalancer");
    rebalancer = await AutoFiRebalancer.deploy(pool.address, supraOracle.address, supraAIAgent.address);
    await rebalancer.deployed();

    const AutoFiFeeAdjuster = await ethers.getContractFactory("AutoFiFeeAdjuster");
    feeAdjuster = await AutoFiFeeAdjuster.deploy(pool.address);
    await feeAdjuster.deployed();

    const AutoFiYieldHarvester = await ethers.getContractFactory("AutoFiYieldHarvester");
    yieldHarvester = await AutoFiYieldHarvester.deploy(pool.address, supraNova.address, "0x...Aave");
    await yieldHarvester.deployed();

    const AutoFiMissions = await ethers.getContractFactory("AutoFiMissions");
    missions = await AutoFiMissions.deploy(staking.address, meplToken.address, supraDVRF.address, supraOracle.address);
    await missions.deployed();

    const AutoFiBurnScheduler = await ethers.getContractFactory("AutoFiBurnScheduler");
    burnScheduler = await AutoFiBurnScheduler.deploy(meplToken.address, supraAutoFi.address);
    await burnScheduler.deployed();
  });

  it("should rebalance pool on volatility", async function () {
    await rebalancer.rebalancePool();
    const supraWeight = await pool.supraWeight();
    expect(supraWeight).to.equal(80); // AI-driven rebalance
  });

  it("should adjust fees based on volume", async function () {
    await feeAdjuster.adjustFee(ethers.utils.parseEther("2000000"));
    expect(await pool.dynamicFee()).to.equal(100); // 1% fee
  });

  it("should harvest yields via SupraNova", async function () {
    await supraToken.approve(yieldHarvester.address, ethers.utils.parseEther("100"));
    await yieldHarvester.harvestYield(supraToken.address, ethers.utils.parseEther("100"));
    // Verify SupraNova interaction
  });

  it("should distribute mission rewards with dVRF", async function () {
    await missions.setSentimentBoost(memecoins[0], 150);
    await missions.checkMission(testAddress);
    expect(await missions.missionProgress(testAddress)).to.be.above(0);
  });

  it("should schedule burns", async function () {
    await burnScheduler.scheduleBurn();
    // Verify AutoFi task scheduling
  });
});