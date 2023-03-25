/**
* @type import(‘hardhat/config’).HardhatUserConfig
*/
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
        solidity: "0.8.0",
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