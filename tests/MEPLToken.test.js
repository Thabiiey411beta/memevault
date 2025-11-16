const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MEPLToken", function () {
  let meplToken, admin, autoFi;
  const adminAddress = "0xa2525317402889d48AF009E1ae4E5a8baAa6e11c";
  const testAddress = "0x9516494976a6de49218b86c96cceac7eb0366de6610d068e861b3636beec1915";

  beforeEach(async function () {
    [admin, autoFi] = await ethers.getSigners();
    const MEPLToken = await ethers.getContractFactory("MEPLToken");
    meplToken = await MEPLToken.deploy(adminAddress);
    await meplToken.deployed();
    await meplToken.grantRole(ethers.utils.keccak256("AUTO_FI_ROLE"), testAddress);
  });

  it("should burn 12% until 500M, then 3% until 100M", async function () {
    let supply = await meplToken.totalSupply();
    expect(supply).to.equal(ethers.utils.parseEther("2000000000"));

    for (let i = 0; i < 6; i++) {
      await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await network.provider.send("evm_mine");
      await meplToken.connect(await ethers.getSigner(testAddress)).burnMonthly();
    }
    supply = await meplToken.totalSupply();
    expect(supply).to.be.closeTo(ethers.utils.parseEther("464404176"), ethers.utils.parseEther("1000000"));

    for (let i = 0; i < 51; i++) {
      await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await network.provider.send("evm_mine");
      await meplToken.connect(await ethers.getSigner(testAddress)).burnMonthly();
    }
    supply = await meplToken.totalSupply();
    expect(supply).to.equal(ethers.utils.parseEther("800000000")); // 100M circulating + 700M non-circulating

    await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
    await network.provider.send("evm_mine");
    await expect(meplToken.connect(await ethers.getSigner(testAddress)).burnMonthly()).to.be.revertedWith("Burn permanently stopped");
  });
});