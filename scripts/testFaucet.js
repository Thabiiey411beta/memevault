const { ethers } = require("hardhat");

async function main() {
  const adminAddress = "0xa2525317402889d48AF009E1ae4E5a8baAa6e11c";
  const testAddress = "0x9516494976a6de49218b86c96cceac7eb0366de6610d068e861b3636beec1915";
  const faucetEndpoint = "https://faucet.supra.com/stagingnet";

  const fundWallet = async (address) => {
    const response = await fetch(faucetEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, network: "EVM Stagingnet", asset: "EVM Staging Token" })
    });
    console.log(`Funded ${address}:`, await response.json());
  };

  await fundWallet(adminAddress);
  await fundWallet(testAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});