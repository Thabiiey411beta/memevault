import DepositForm from "../components/DepositForm";
import IndexTokenInfo from "../components/IndexTokenInfo";

function Pool() {
  return (
    <div className="container mt-4">
      <h2>MemeVault Pool</h2>
      <DepositForm />
      <IndexTokenInfo />
    </div>
  );
}

export default Pool;