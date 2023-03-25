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
               url: "https://polygon-mumbai.g.alchemy.com/v2/KEB-3zJIeqcA1FvFMHKDCj8OqobNL4ad",
               accounts: [`136a9cb5422df0d96c0d5c5893d04c1398de00a46da8a5199ff7bb7ecc35ec67`],           }
        },
        etherscan: {
           apiKey: {
            polygonMumbai: "GEE53FU137BXBQ2I5VY3CU3964MSW74XT"
         },
        },
};