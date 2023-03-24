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
               accounts: [`0x3df43ee50ed4275cdf822b4a7056471c1b7bc7074b097808303f978b460ae3ab`],           }
        },
        etherscan: {
           apiKey: {
            polygonMumbai: "GEE53FU137BXBQ2I5VY3CU3964MSW74XT"
         },
        },
};