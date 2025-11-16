// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IHyperNova.sol";
import "../core/MemeVaultPool.sol";

contract AutoFiYieldHarvester {
    MemeVaultPool public pool;
    IHyperNova public hyperNova;
    address public externalProtocol; // e.g., Aave

    constructor(address _pool, address _hyperNova, address _externalProtocol) {
        pool = MemeVaultPool(_pool);
        hyperNova = IHyperNova(_hyperNova);
        externalProtocol = _externalProtocol;
    }

    function harvestYield(address token, uint256 amount) external {
        IERC20(token).approve(address(hyperNova), amount);
        hyperNova.transferToChain(externalProtocol, token, amount);
    }
}