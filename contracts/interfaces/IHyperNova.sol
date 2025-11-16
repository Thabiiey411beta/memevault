// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHyperNova {
    function transferToChain(address destination, address token, uint256 amount) external;
}