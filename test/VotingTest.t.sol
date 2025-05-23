// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "lib/forge-std/src/Test.sol";
import {Voting} from "../src/Voting.sol";

contract VotingTest is Test{
    Voting voting;
    address owner;
    address voter1;
    address voter2;
    string[] candidates;
    uint256 votingDuration;

    function setUp() public {
        owner = address(this);
        voter1 = address(0x123);
        voter2 = address(0x456);
        votingDuration = 90;
        // Define candidates...
        candidates.push("Mark");
        candidates.push("Mike");
        candidates.push("Henry");
        candidates.push("Rock");

        voting = new Voting(candidates, votingDuration);
    }

    function testDeployment() public view {
        (string memory name1, ) = voting.candidates(0);
        (string memory name2, ) = voting.candidates(1);

        assertEq(name1, "Mark");
        assertEq(name2, "Mike");

        assertEq(
            voting.VotingEnd(),
            voting.VotingStart() + (votingDuration * 1 minutes)
        );
    }

    function testVoting() public {
        vm.prank(voter1);
        voting.vote(0);

        (, uint256 voteCount) = voting.candidates(0);
        assertEq(voteCount, 1);

        vm.expectRevert("You have already VOTED");
        vm.prank(voter1);
        voting.vote(0);
    }

    function testVotingStatus() public {
        assertTrue(voting.getVotingStatus());

        vm.warp(voting.VotingEnd() + 1);
        assertFalse(voting.getVotingStatus());
    }

    function testRemainingTime() public {
        assertEq(
            voting.getRemainingTime(),
            voting.VotingEnd() - block.timestamp
        );
        vm.warp(voting.VotingEnd() + 1);
        assertEq(voting.getRemainingTime(), 0);
    }

    function testOnlyOwnerCanAddCandidate() public {
        voting.addCandidate("NewCandidate");
        (string memory newCandidate, ) = voting.candidates(4);
        assertEq(newCandidate, "NewCandidate");

        vm.expectRevert();
        vm.prank(voter1);
        voting.addCandidate("IllegalCandidate");
    }
}
