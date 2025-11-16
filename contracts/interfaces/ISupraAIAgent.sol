// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISupraAIAgent {
    function predictVolatility() external view returns (bool, uint256);
}