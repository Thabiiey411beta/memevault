// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../core/MemeVaultPool.sol";
import "../interfaces/ISupraOracle.sol";

contract AutoFiRebalancer {
    MemeVaultPool public pool;
    ISupraOracle public supraOracle;
    uint256 public constant VOLATILITY_THRESHOLD = 10e18; // 10% price change

    constructor(address _pool, address _supraOracle) {
        pool = MemeVaultPool(_pool);
        supraOracle = ISupraOracle(_supraOracle);
    }

    function rebalancePool() external {
        for (uint256 i = 0; i < pool.memecoins().length; i++) {
            address memecoin = pool.memecoins(i);
            uint256 currentPrice = supraOracle.getPrice(memecoin);
            uint256 historicalPrice = supraOracle.getHistoricalPrice(memecoin, block.timestamp - 1 days);
            if ((currentPrice * 1e18) / historicalPrice > VOLATILITY_THRESHOLD) {
                pool.rebalance(80, 20); // Shift to 80% $SUPRA
                break;
            }
        }
    }
}