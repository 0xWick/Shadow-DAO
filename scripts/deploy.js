require('@nomiclabs/hardhat-waffle');


async function main() {
  
  const verifierContract = "ShadowDAO";

  const ShadowDAO = await ethers.getContractFactory(verifierContract);
  const shadowDAO = await ShadowDAO.deploy();
  console.log("Deploying......")
  await shadowDAO.deployed();
  console.log("Contract Deployed at:", shadowDAO.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });