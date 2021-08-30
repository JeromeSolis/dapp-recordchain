// migrating the appropriate contracts
var ArtistRole = artifacts.require("./ArtistRole.sol");
var LabelRole = artifacts.require("./LabelRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(ArtistRole);
  deployer.deploy(LabelRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
