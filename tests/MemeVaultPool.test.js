const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeVaultPool", function () {
  let pool, supraToken, memecoins, supraOracle, treasury, admin, user;
  const adminAddress = "0xa2525317402889d48AF009E1ae4E5a8baAa6e11c";
  const testAddress = "0x9516494976a6de49218b86c96cceac7eb0366de6610d068e861b3636beec1915";

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();
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

    treasury = adminAddress;

    const MemeVaultPool = await ethers.getContractFactory("MemeVaultPool");
    pool = await MemeVaultPool.deploy(supraToken.address, memecoins, supraOracle.address, treasury, adminAddress);
    await pool.deployed();

    await supraToken.connect(user).approve(pool.address, ethers.utils.parseEther("1000"));
    for (let i = 0; i < memecoins.length; i++) {
      const memecoin = await ethers.getContractAt("MockERC20", memecoins[i]);
      await memecoin.connect(user).approve(pool.address, ethers.utils.parseEther("100"));
    }
  });

  it("should allow deposits and issue stMEME", async function () {
    await pool.connect(user).deposit(
      ethers.utils.parseEther("700"),
      [ethers.utils.parseEther("100"), ethers.utils.parseEther("100"), ethers.utils.parseEther("100")]
    );
    const balance = await pool.balanceOf(user.address);
    expect(balance).to.be.above(0);
  });

  it("should allow withdrawals", async function () {
    await pool.connect(user).deposit(
      ethers.utils.parseEther("700"),
      [ethers.utils.parseEther("100"), ethers.utils.parseEther("100"), ethers.utils.parseEther("100")]
    );
    const balance = await pool.balanceOf(user.address);
    await pool.connect(user).withdraw(balance);
    expect(await pool.balanceOf(user.address)).to.equal(0);
  });

  it("should collect fees for AutoFi", async function () {
    await pool.grantRole(ethers.utils.keccak256("AUTO_FI_ROLE"), testAddress);
    await supraToken.transfer(pool.address, ethers.utils.parseEther("100"));
    await pool.connect(await ethers.getSigner(testAddress)).collectFee(ethers.utils.parseEther("100"));
    expect(await supraToken.balanceOf(treasury)).to.equal(ethers.utils.parseEther("10")); // 10% treasury
  });
});