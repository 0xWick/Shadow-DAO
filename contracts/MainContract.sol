// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";

contract ShadowDAO is ZKPVerifier {

    // ********** DAO CONTRACT CODE **********88
    // ** Satte Variables
    uint256 public proposalId = 1;
    address public DAOowner;

    // ** Structs
    // ** Proposal Struct
    struct proposal{
        uint256 id;
        bool exists;
        string description;
        uint256 RequiredAmount;
        address proposer;
        uint deadline;
        uint256 votesUp;
        uint256 votesDown;
        mapping(address => bool) voteStatus;
        bool countConducted;
        bool passed;
    }

    
    // ** MAPPINGS
    // * Track all proposals with id
    mapping(uint256 => proposal) public Proposals;

    // * User Donations
    mapping(address => uint256) public addressToDonation;

    // * Using Mappings instead of arrays for getting O(1)
    // ? Addresses of User's who have identified themselves
    mapping(address => bool) public isMember;

    // * Registered Users
    mapping(uint256 => bool) public IdToRegistered;
    mapping(uint256 => address) public IdToAddress;

    mapping(address => uint256) public addressToId;

    
    // ** EVENTS
    event proposalCreated(
        uint256 id,
        string description,
        uint256 requiredAmount,
        address proposer
    );

    event newVote(
        uint256 votesUp,
        uint256 votesDown,
        address voter,
        uint256 proposal,
        bool votedFor
    );

    event proposalCount(
        uint256 id,
        bool passed
    );

    event userRegistered(
        uint256 userPID,
        address userAddress,
        bool added,
        bool removed
    );

  

}