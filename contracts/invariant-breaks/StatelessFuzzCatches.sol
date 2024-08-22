//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StatelessFuzzCatches {
    function doMath(uint128 number) public pure returns (uint128) {
        if (number == 2) {
            return 0;
        }
        return 1;
    }
}
