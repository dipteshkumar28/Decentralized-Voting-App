// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {Voting} from "../src/Voting.sol";

contract DeployVoting is Script{
    function run() external {
        vm.startBroadcast();
        string[] memory candidates = new string[](4);
        candidates[0] = "Mark";
        candidates[1] = "Mike";
        candidates[2] = "Henry";
        candidates[3] = "Rock";
        Voting voting = new Voting(candidates, 90);
        console.log("Contract deployed at:", address(voting));
        vm.stopBroadcast();
    }
}
