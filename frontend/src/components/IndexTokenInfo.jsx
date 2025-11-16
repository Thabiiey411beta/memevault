import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractConfig } from "../contracts/contractConfig";

function IndexTokenInfo() {
  const [balance, setBalance] = useState(0);
  const [poolComposition, setPoolComposition] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const indexContract = new ethers.Contract(
        contractConfig.index.address,
        contractConfig.index.abi,
        provider
      );
      const poolContract = new ethers.Contract(
        contractConfig.pool.address,
        contractConfig.pool.abi,
        provider
      );

      const userBalance = await indexContract.balanceOf(await signer.getAddress());
      setBalance(ethers.utils.formatEther(userBalance));

      const memecoins = await poolContract.memecoins();
      const composition = { supra: await poolContract.supraWeight() };
      for (let i = 0; i < memecoins.length; i++) {
        composition[`memecoin${i}`] = await poolContract.memecoinWeight() / memecoins.length;
      }
      setPoolComposition(composition);
    };

    fetchData();
  }, []);

  return (
    <div className="card p-3">
      <h3>MEME-INDEX Token</h3>
      <p>Balance: {balance} MEME-INDEX</p>
      <h4>Pool Composition</h4>
      <p>$SUPRA: {poolComposition.supra}%</p>
      {Object.keys(poolComposition).map((key, index) => (
        key !== "supra" && <p key={index}>Memecoin {index + 1}: {poolComposition[key]}%</p>
      ))}
    </div>
  );
}

export default IndexTokenInfo;