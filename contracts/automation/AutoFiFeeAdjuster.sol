// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../core/MemeVaultPool.sol";

contract AutoFiFeeAdjuster {
    MemeVaultPool public pool;
    uint256 public constant HIGH_VOLUME_THRESHOLD = 1_000_000 * 1e18; // $1M
    uint256 public constant LOW_FEE = 10; // 0.1%
    uint256 public constant HIGH_FEE = 100; // 1%

    constructor(address _pool) {
        pool = MemeVaultPool(_pool);
    }

    function adjustFee(uint256 dailyVolume) external {
        if (dailyVolume > HIGH_VOLUME_THRESHOLD) {
            pool.setDynamicFee(HIGH_FEE);
        } else {
            pool.setDynamicFee(LOW_FEE);
        }
    }
}