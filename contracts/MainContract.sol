// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";

contract ShadowDAO is ZKPVerifier {

    // ********** DAO CONTRACT CODE **********88
    // ** State Variables
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

      // ** FUNCTIONS

    // * FINANCE
    // * Donate to the DAO
    function Donate() public payable {
        // * Add address with its donation to mapping
        addressToDonation[msg.sender] += msg.value;
    }
    
    // * Withdraw DAO Funds
    function withdrawAll() external {
        // * Sender must be Owner
        require(msg.sender == DAOowner, "Not Authorized to Withdraw");

        // * Transfer all balance to DAO Owner
        payable(DAOowner).transfer(address(this).balance);
    }

     function getDaoBalance() external view returns(uint) {
        return address(this).balance;
    }

    // * Create a Proposal
    function createProposal(string memory _description, uint256 _requiredAmount) public {
        // ** Polygon ID Check for Creating a Proposal
        // ? Yes, A single proposer can (try to) add multiple addresses, like a sybil attack
        // ? But that shouldn't be a problem because we only allow them to
        // ? Verify the proof "ONLY ONCE" and add any address
        // * Only a "Member" or "Owner" can create a Proposal
        require(isMember[msg.sender] == true || msg.sender == DAOowner, "Member ID Not Verified!");

        // * Creating a Proposal
        proposal storage newProposal = Proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.exists = true;
        newProposal.description = _description;
        
        // * Finance
        // ? Goal amount of the proposal
        newProposal.RequiredAmount = _requiredAmount;
        
        // * Benificiary
        // ? Receiver of the amount if proposal's accepted
        newProposal.proposer = msg.sender;
        newProposal.deadline = block.number + 500;
        
        // * Emit proposalCreated Event, to use the logs on FrontEnd
        emit proposalCreated(proposalId, _description, _requiredAmount, msg.sender);

        // * Add 1 to proposalId var to avoid proposal collision
        proposalId++;
    }

    // ** Vote on a Proposal
    function voteOnProposal(uint256 _id, bool _vote) public {
        require(Proposals[_id].exists, "This Proposal does not exist");
        // ** Polygon ID Check for Voting
        require(isMember[msg.sender] == true || msg.sender == DAOowner, "Member ID Not Verified");
        require(!Proposals[_id].voteStatus[msg.sender], "You have already voted on this Proposal");
        require(block.number <= Proposals[_id].deadline, "The deadline has passed for this Proposal");

        // * Get Proposal
        proposal storage p = Proposals[_id];

        // * Add vote
        if(_vote) {
            p.votesUp++;
        }else{
            p.votesDown++;
        }

        // * Add sender's address to User's Done with Voting on this Proposal
        p.voteStatus[msg.sender] = true;

        // * Emit newVote Event
        // ? Latest details of Voting on this (_id)Proposal 
        emit newVote(p.votesUp, p.votesDown, msg.sender, _id, _vote);
        
    }

    // ** Count Votes for a Proposal After Deadline
    function countVotes(uint256 _id) public {
        require(msg.sender == DAOowner, "Owner ID Not Verified");
        require(Proposals[_id].exists, "This Proposal does not exist");
        require(block.number > Proposals[_id].deadline, "Voting has not concluded");
        require(!Proposals[_id].countConducted, "Count already conducted");

        // * Get Proposal
        proposal storage p = Proposals[_id];
        
        // * "Only If" downVotes are smaller than upVotes, mark Proposal as Passed
        if(Proposals[_id].votesDown < Proposals[_id].votesUp){
            // * Proposal Passed
            p.passed = true;
            if (p.RequiredAmount >= address(this).balance) {
                payable(p.proposer).transfer(address(this).balance);
            }
            else {
            // * Send requiredAmount to Proposer
            payable(p.proposer).transfer(p.RequiredAmount);
            }
        }

        // * Poll Conducted
        p.countConducted = true;

        // * Emit proposalCount, (_id)Proposal is ended with a result True/False (passed/rejected)
        emit proposalCount(_id, p.passed);
    }

    // ** Revoke Membership if someone acts malicious
    function revokeMembership(address _memberAddress) public {
        // * Only Owner can revoke permissions
        require(msg.sender == DAOowner, "Not Authorized to remove a Member!");

        // * Revoke Permission
        isMember[_memberAddress] = false;
    }

    // ** New Registration for new proof issue
    // ? Old Details of User Removed, So He can register a new one
    function newMembership(uint256 _userPID) public {
        // * Only Owner can revoke permissions
        require(msg.sender == DAOowner, "Not Authorized to issue NewMembership!");

        // * Clear name
        IdToRegistered[_userPID] = false;
        // * Remove old address
        address oldAddress = IdToAddress[_userPID];
        isMember[oldAddress] = false;

        // * Emit userRegistered with details
        // ? Added = false, Removed = true
        // ? User data is removed so he can get a membership with a new address
        emit userRegistered(_userPID, oldAddress, false, true);
    }

    // ***************** POLYGON ID ZK CODE *****************
    // * REQUEST IDs
    // ? Distinguish b/w different type of Query Requests
    uint64 public constant MEMBER_REQUEST_ID = 1;
    uint64 public constant OWNER_REQUEST_ID = 2;

    // * Mapping Registered Users
    mapping(uint256 => bool) public IdToRegistered;
    mapping(uint256 => address) public IdToAddress;

    mapping(address => uint256) public addressToId;


    // * Polygon ID FUNCTIONS

    // * Security Checks
     function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // * Avoid Proof FrontRunning
        // ? Check Address in challenge input of the proof is equal to the msg.sender 
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in proof is not a sender address"
        );
    }

    // * Logic according to the requestID
    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        
        // * Get Current User PID
        uint256 userPID = inputs[validator.getUserIdInputIndex()];
        
        // * Check if PID already Registered
        // ? This mapping checks if the user has registered using this PID before!
        // ? He can ask for newMembership and register again with a new eth address
        require(IdToRegistered[userPID] == false, "User already Registered an address");
        require(isMember[_msgSender()] == false, "User Address already Registered");

        // * For Member Verification
        if (requestId == MEMBER_REQUEST_ID) {
            // * Member Logic
            isMember[_msgSender()] = true;

            // * Add PID to registered Users
            IdToRegistered[userPID] = true;
            IdToAddress[userPID] = _msgSender();
            addressToId[_msgSender()] = userPID;

            // * Emit New UserRegistered
            emit userRegistered(userPID, _msgSender(), true, false);
        }   

        // * For Owner Verification
        else if (requestId == OWNER_REQUEST_ID) {
                // * OWNER Logic
                DAOowner = _msgSender();

                // * Add PID to registered Users
                IdToRegistered[userPID] = true;
                IdToAddress[userPID] = _msgSender();
                addressToId[_msgSender()] = userPID;
                
                // * Emit New UserRegistered
                emit userRegistered(userPID, _msgSender(), true, false);
        }
    }

}