// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MemeVaultPool.sol";

contract MemeIndexToken is ERC20 {
    MemeVaultPool public pool;

    constructor(address _pool) ERC20("MemeVault Index Token", "MEME-INDEX") {
        pool = MemeVaultPool(_pool);
    }

    function mint(address user, uint256 amount) external {
        require(msg.sender == address(pool), "Only pool can mint");
        _mint(user, amount);
    }

    function burn(address user, uint256 amount) external {
        require(msg.sender == address(pool), "Only pool can burn");
        _burn(user, amount);
    }
}