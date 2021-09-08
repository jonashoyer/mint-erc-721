const BetterNFT = artifacts.require("BetterNFT");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(BetterNFT, 'BetterNFT', 'BFT', 'http://127.0.0.1:3000/api/img/', 4096);
};
