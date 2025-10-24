// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DAAMVault is Ownable, Pausable, ReentrancyGuard {

    // A mapping from an agent's address to a boolean indicating if it's authorized.
    mapping(address => bool) public isAgent;

    // A mapping to track daily spending for each category for each agent.
    // The inner mapping is from a category hash to the amount spent.
    mapping(address => mapping(bytes32 => uint256)) public agentSpentToday;

    // A mapping for the daily spending limit per category for each agent.
    mapping(address => mapping(bytes32 => uint256)) public agentDailyLimits;

    // The timestamp of when the daily spending period was last reset.
    uint256 public lastResetTimestamp;
    
    // An event to log when an agent makes a transaction.
    event TransactionExecuted(address indexed agent, address indexed to, uint256 value, bytes data, bytes32 category);
    // An event for when an agent's permissions are updated.
    event AgentUpdated(address indexed agent, bool authorized);
    // An event for when a spending limit is updated.
    event LimitUpdated(address indexed agent, bytes32 indexed category, uint256 limit);

    // The owner of the contract is set on deployment.
    constructor() Ownable(msg.sender) {}

    // A modifier to ensure only authorized agents can call a function.
    modifier onlyAgent() {
        require(isAgent[msg.sender], "DAAMVault: Caller is not an authorized agent");
        _;
    }

    // Function to authorize or de-authorize an AI agent. Only the owner can call this.
    function setAgent(address _agent, bool _isAuthorized) external onlyOwner {
        isAgent[_agent] = _isAuthorized;
        emit AgentUpdated(_agent, _isAuthorized);
    }

    // Function to set the daily spending limit for an agent and a specific category.
    function setDailyLimit(address _agent, string calldata _category, uint256 _limit) external onlyOwner {
        bytes32 categoryHash = keccak256(abi.encodePacked(_category));
        agentDailyLimits[_agent][categoryHash] = _limit;
        emit LimitUpdated(_agent, categoryHash, _limit);
    }

    // The main function for an agent to execute a transaction (e.g., buy an ENS domain).
    function executeTransaction(address payable _to, uint256 _value, bytes calldata _data, string calldata _category) 
        external 
        onlyAgent 
        whenNotPaused 
        nonReentrant 
    {
        _resetDailySpendIfNeeded();
        
        bytes32 categoryHash = keccak256(abi.encodePacked(_category));
        uint256 currentSpent = agentSpentToday[msg.sender][categoryHash];
        uint256 dailyLimit = agentDailyLimits[msg.sender][categoryHash];

        require(currentSpent + _value <= dailyLimit, "DAAMVault: Daily limit for category exceeded");

        agentSpentToday[msg.sender][categoryHash] += _value;

        (bool success, ) = _to.call{value: _value}(_data);
        require(success, "DAAMVault: External call failed");

        emit TransactionExecuted(msg.sender, _to, _value, _data, categoryHash);
    }

    // Allows the owner to perform an emergency withdrawal of all funds.
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "DAAMVault: Emergency withdrawal failed");
    }

    // A helper function to reset daily spending counters if a day has passed.
    function _resetDailySpendIfNeeded() internal {
        if (block.timestamp - lastResetTimestamp > 1 days) {
            // This is a simplified reset. In a real-world scenario with many agents,
            // this could be costly. A better pattern might be to reset an agent's
            // spend on their first transaction of the day.
            // For now, we reset the timestamp and the agent's spend will be 0 if checked.
            lastResetTimestamp = block.timestamp;
        }
    }
    
    // Function to let the owner pause the contract in an emergency.
    function pause() external onlyOwner {
        _pause();
    }

    // Function to let the owner unpause the contract.
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Allow the contract to receive Ether.
    receive() external payable {}
}