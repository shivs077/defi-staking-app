pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        owner = msg.sender;
        rwd = _rwd;
        tether = _tether;
    }

    // staking function
    function depositTokens(uint256 _amount) public {
        // Require the staking amount to be greater than zero
        require(_amount > 0, "amount cannot be zero");
        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller must be owner");
        _;
    }

    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient] / 9; // divide by 9 to create percentage incentive
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        // require the amount to be greater than zero
        require(balance > 0, "staking balance cannot be less than zero");

        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}
