require('@nomiclabs/hardhat-waffle');


async function main() {
  
  const verifierContract = "DAOVerifier";

  const DAOVerifier = await ethers.getContractFactory(verifierContract);
  const daoVerifier = await DAOVerifier.deploy();
  console.log("Deploying......")
  await daoVerifier.deployed();
  console.log("Contract Deployed at:", daoVerifier.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });