const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");
async function main() {
// Verify the contract after deploying
await hre.run("verify:verify", {
address: "0xa69037242d13eb61aDA6C7Efea36C4a2a4Bf6D9f",
constructorArguments: [],
});
}
// Call the main function and catch if there is any error
main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});