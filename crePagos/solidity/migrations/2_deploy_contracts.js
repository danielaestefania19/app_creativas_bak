var crePagos = artifacts.require('solidity/contracts/crePagos.sol');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(crePagos, accounts[4]);
};
