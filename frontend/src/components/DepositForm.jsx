import { useState } from "react";
import { ethers } from "ethers";
import { contractConfig } from "../contracts/contractConfig";

function DepositForm() {
  const [supraAmount, setSupraAmount] = useState("");
  const [memecoinAmounts, setMemecoinAmounts] = useState(["", "", ""]);
  const [error, setError] = useState("");

  const deposit = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const poolContract = new ethers.Contract(
        contractConfig.pool.address,
        contractConfig.pool.abi,
        signer
      );

      // Approve tokens
      const supraContract = new ethers.Contract(
        contractConfig.supra.address,
        contractConfig.supra.abi,
        signer
      );
      await supraContract.approve(contractConfig.pool.address, ethers.utils.parseEther(supraAmount));

      const memecoinAddresses = await poolContract.memecoins();
      for (let i = 0; i < memecoinAddresses.length; i++) {
        const memecoinContract = new ethers.Contract(
          memecoinAddresses[i],
          contractConfig.supra.abi,
          signer
        );
        await memecoinContract.approve(
          contractConfig.pool.address,
          ethers.utils.parseEther(memecoinAmounts[i])
        );
      }

      // Deposit
      await poolContract.deposit(
        ethers.utils.parseEther(supraAmount),
        memecoinAmounts.map((amt) => ethers.utils.parseEther(amt))
      );
      alert("Deposit successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card p-3">
      <h3>Deposit to MemeVault Pool</h3>
      <input
        type="number"
        placeholder="$SUPRA Amount"
        value={supraAmount}
        onChange={(e) => setSupraAmount(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="number"
        placeholder="DOGE Amount"
        value={memecoinAmounts[0]}
        onChange={(e) => setMemecoinAmounts([e.target.value, memecoinAmounts[1], memecoinAmounts[2]])}
        className="form-control mb-2"
      />
      <input
        type="number"
        placeholder="SHIB Amount"
        value={memecoinAmounts[1]}
        onChange={(e) => setMemecoinAmounts([memecoinAmounts[0], e.target.value, memecoinAmounts[2]])}
        className="form-control mb-2"
      />
      <input
        type="number"
        placeholder="PEPE Amount"
        value={memecoinAmounts[2]}
        onChange={(e) => setMemecoinAmounts([memecoinAmounts[0], memecoinAmounts[1], e.target.value])}
        className="form-control mb-2"
      />
      <button onClick={deposit} className="btn btn-primary">Deposit</button>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default DepositForm;