const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingVault", function () {
  let staking, supraToken, stMEME, meplToken, supraDVRF, admin, user;
  const adminAddress = "0xa2525317402889d48AF009E1ae4E5a8baAa6e11c";
  const testAddress = "0x9516494976a6de49218b86c96cceac7eb0366de6610d068e861b3636beec1915";

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();
    const SupraToken = await ethers.getContractFactory("MockERC20");
    supraToken = await SupraToken.deploy("Supra", "SUPRA", ethers.utils.parseEther("1000000"));
    await supraToken.deployed();

    stMEME = await SupraToken.deploy("stMEME", "stMEME", ethers.utils.parseEther("1000000"));
    await stMEME.deployed();

    const MEPLToken = await ethers.getContractFactory("MEPLToken");
    meplToken = await MEPLToken.deploy(adminAddress);
    await meplToken.deployed();

    const MockSupraDVRF = await ethers.getContractFactory("MockSupraDVRF");
    supraDVRF = await MockSupraDVRF.deploy();
    await supraDVRF.deployed();

    const StakingVault = await ethers.getContractFactory("StakingVault");
    staking = await StakingVault.deploy(supraToken.address, stMEME.address, meplToken.address, supraDVRF.address, adminAddress);
    await staking.deployed();

    await stMEME.connect(user).approve(staking.address, ethers.utils.parseEther("1000"));
    await supraToken.connect(user).approve(staking.address, ethers.utils.parseEther("1000"));
    await meplToken.distributeRewards(staking.address, ethers.utils.parseEther("1000"));
  });

  it("should allow staking stMEME and $SUPRA", async function () {
    await staking.connect(user).stake(ethers.utils.parseEther("500"), ethers.utils.parseEther("500"));
    expect(await staking.stakedBalances(user.address)).to.equal(ethers.utils.parseEther("1000"));
  });

  it("should distribute rewards with dVRF", async function () {
    await staking.connect(user).stake(ethers.utils.parseEther("500"), ethers.utils.parseEther("500"));
    await supraToken.transfer(staking.address, ethers.utils.parseEther("100"));
    await staking.connect(user).claimRewards();
    expect(await meplToken.balanceOf(user.address)).to.be.above(0);
    expect(await supraToken.balanceOf(user.address)).to.be.above(0);
  });
});