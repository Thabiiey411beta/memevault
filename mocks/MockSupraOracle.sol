// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockSupraOracle {
    mapping(address => uint256) public prices;
    mapping(address => uint256) public historicalPrices;
    mapping(address => uint256) public sentimentScores;

    function setPrice(address token, uint256 price) external {
        prices[token] = price;
    }

    function setHistoricalPrice(address token, uint256 timestamp, uint256 price) external {
        historicalPrices[token] = price;
    }

    function setSentimentScore(address token, uint256 score) external {
        sentimentScores[token] = score;
    }

    function getPrice(address token) external view returns (uint256) {
        return prices[token];
    }

    function getHistoricalPrice(address token, uint256) external view returns (uint256) {
        return historicalPrices[token];
    }

    function getSentimentScore(address token) external view returns (uint256) {
        return sentimentScores[token];
    }
}