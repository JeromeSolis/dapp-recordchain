pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'FarmerRole' to manage this role - add, remove, check
contract LabelRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event LabelAdded(address indexed account);
  event LabelRemoved(address indexed account);

  // Define a struct 'farmers' by inheriting from 'Roles' library, struct Role
  Roles.Role private labels;

  // In the constructor make the address that deploys this contract the 1st farmer
  constructor() public {
    _addLabel(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyLabel() {
    require(isLabel(msg.sender));
    _;
  }

  // Define a function 'isFarmer' to check this role
  function isLabel(address account) public view returns (bool) {
    return labels.has(account);
  }

  // Define a function 'addFarmer' that adds this role
  function addLabel(address account) public onlyLabel {
    _addLabel(account);
  }

  // Define a function 'renounceFarmer' to renounce this role
  function renounceLabel() public {
    _removeLabel(msg.sender);
  }

  // Define an internal function '_addFarmer' to add this role, called by 'addFarmer'
  function _addLabel(address account) internal {
    labels.add(account);
    emit LabelAdded(account);
  }

  // Define an internal function '_removeFarmer' to remove this role, called by 'removeFarmer'
  function _removeLabel(address account) internal {
    labels.remove(account);
    emit LabelRemoved(account);
  }
}