// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISupraOracle {
    function getPrice(address token) external view returns (uint256);
    function getHistoricalPrice(address token, uint256 timestamp) external view returns (uint256);
}