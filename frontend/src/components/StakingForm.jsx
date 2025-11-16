import { useState } from "react";
import { ethers } from "ethers";
import { contractConfig } from "../contracts/contractConfig";

function StakingForm() {
  const [stMEMEAmount, setStMEMEAmount] = useState("");
  const [supraAmount, setSupraAmount] = useState("");
  const [error, setError] = useState("");

  const stake = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(
        contractConfig.staking.address,
        contractConfig.staking.abi,
        signer
      );

      // Approve tokens
      const stMEMEContract = new ethers.Contract(
        contractConfig.pool.address,
        contractConfig.pool.abi,
        signer
      );
      const supraContract = new ethers.Contract(
        contractConfig.supra.address,
        contractConfig.supra.abi,
        signer
      );
      await stMEMEContract.approve(contractConfig.staking.address, ethers.utils.parseEther(stMEMEAmount));
      await supraContract.approve(contractConfig.staking.address, ethers.utils.parseEther(supraAmount));

      // Stake
      await stakingContract.stake(
        ethers.utils.parseEther(stMEMEAmount),
        ethers.utils.parseEther(supraAmount)
      );
      alert("Stake successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card p-3">
      <h3>Stake stMEME and $SUPRA</h3>
      <input
        type="number"
        placeholder="stMEME Amount"
        value={stMEMEAmount}
        onChange={(e) => setStMEMEAmount(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="number"
        placeholder="$SUPRA Amount"
        value={supraAmount}
        onChange={(e) => setSupraAmount(e.target.value)}
        className="form-control mb-2"
      />
      <button onClick={stake} className="btn btn-primary">Stake</button>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default StakingForm;