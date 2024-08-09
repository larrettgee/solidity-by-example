// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProxyAdmin {
    address public owner;
    address public implementation;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function upgrade(address _newImplementation) external onlyOwner {
        implementation = _newImplementation;
    }

    function getImplementation() external view returns (address) {
        return implementation;
    }
}

contract Proxy {
    ProxyAdmin public proxyAdmin;

    constructor(address _proxyAdmin) {
        proxyAdmin = ProxyAdmin(_proxyAdmin);
    }

    fallback() external payable {
        address impl = proxyAdmin.getImplementation();
        require(impl != address(0), "Implementation contract not set");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {
                revert(ptr, size)
            }
            default {
                return(ptr, size)
            }
        }
    }

    receive() external payable {}
}

contract InnocentContract {
    function getValue() external pure returns (uint256) {
        return 69;
    }
}

contract BadBoyContract {
    function getValue() external pure returns (uint256) {
        return 100;
    }
}
