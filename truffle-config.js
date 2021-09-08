require('babel-register');
require('babel-polyfill');
require('dotenv').config();

require("ts-node").register({
  files: true,
});

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 5777
    },
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './build/contracts/',
  migrations_directory: "./migrations",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: false,
        runs: 200
      }
    }
  }
}