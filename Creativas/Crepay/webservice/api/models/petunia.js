module.exports = function (web3) {

  const contract = require('./contract');

  const crePagos = web3.eth.contract(contract.contractABI).at(contract.contractAddress);
  web3.eth.getAccounts((error, result) => {
    crePagos.account = result[0]
  });

  return crePagos;
};
