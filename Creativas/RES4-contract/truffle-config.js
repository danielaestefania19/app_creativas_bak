const HDWalletProvider = require('@truffle/hdwallet-provider');
supervisor='1c111255c3fabe7b38089c46b09db9e146ce2469955b5796df8a9aa861d4139e';

module.exports = {
  networks: {
    goerli: {
      provider: () => new HDWalletProvider(supervisor, 'https://goerli.infura.io/v3/3fd7c8337c8142f8b3c6b0c0dfa1c565'),
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      networkCheckTimeout: 999999,
      skipDryRun: true
    },
/*     development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    }   */
  },
  
/*   compilers: {
    solc: {
      version: "0.8.21",
    }
  } */

  compilers: {
    solc: {
       version: ">0.4.20 <=0.5.16"
    }
  }


/*   compilers: {
    solc: {
      version: "0.5.0", // Versión global de Solidity
    },
    solc_0420: {
      version: "0.4.20", // Versión específica para la carpeta helper_contracts
    },
  } */

};
