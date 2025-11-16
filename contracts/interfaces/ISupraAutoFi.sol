// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISupraAutoFi {
    function scheduleTask(address target, bytes calldata data, uint256 interval) external;
}