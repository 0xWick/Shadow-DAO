/**
* @type import(‘hardhat/config’).HardhatUserConfig
*/
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
        solidity: {  compilers: [
         {
           version: "0.8.15",
         },
         {
           version: "0.8.0",
         },
         {
           version: "0.8.2",
         },
         {
           version: "0.6.11",
         },
       ],},
        defaultNetwork: "mumbai",
        networks: {
            hardhat: {},
            mumbai: {
               url: process.env.ALCHEMY_API_KEY_URL,
               accounts: [`0x${process.env.MUMBAI_PRIVATE_KEY}`],           }
        },
        etherscan: {
           apiKey: {
            polygonMumbai: process.env.POLYGONSCAN_KEY
         },
        },
};
