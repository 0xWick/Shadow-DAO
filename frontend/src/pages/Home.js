import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, Button } from "web3uikit";
import { Link } from "react-router-dom";
import matic from "../images/Polygon_Faucet.png";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ContractAddress, ContractABI} from "./config.js";


const Moralis = require("moralis").default;


const Home = () => {


  const CloseButton = ({ closeToast }) => (
    <button
      style={{
        borderRadius: "20px",
        backgroundColor: "green",
        border: "solid 2px black",
      }}
    >
      {" "}
      <a
        style={{ color: "white", textDecoration: "none" }}
        href={polygonScan}
        onClick={closeToast}
      >
        Watch on Scan
      </a>{" "}
    </button>
  );

  // * DAO Balance
  const [daoBalance, setDaoBalance] = useState(0);

  // * DAO Balance
  const [polygonScan, setPolygonScan] = useState("");
  // * Donations of current user
  const [donation, setDonation] = useState(0);
  // * Check if User verified or Not
  const [isMember, setIsMember] = useState(true);

  // * PassRate of Proposals
  const [passRate, setPassRate] = useState(0);

  // * Total Proposals
  const [totalP, setTotalP] = useState(0);
  // * Proposals Data
  const [proposals, setProposals] = useState();

  const [isLoading, setLoading] = useState(false);

  // * Proposal Form submission
  const [sub, setSub] = useState(false);

  // * DONATION Form submission
  const [subDonation, setSubDonation] = useState(false);

  const [isOwner, setIsOwner] = useState(false);

  const { isConnected, isDisconnected, address: userAddress } = useAccount();

  // * CONSTANTS

  const BaseUrl = "https://mumbai.polygonscan.com/tx/";

  // * Setup Chain & Contract Address
  const address = ContractAddress
  const chain = 80001;

  // * Generic Functions

  // ? Get Status of a proposal
  async function getStatus(proposalId) {
    const functionName = "Proposals";

    const proposalOptions = {
      abi: ContractABI,
      functionName: functionName,
      address: address,
      chain: chain,
      params: {
        "": proposalId,
      },
    };

    const proposalDetails = await Moralis.EvmApi.utils.runContractFunction(
      proposalOptions
    );

    const result = proposalDetails?.toJSON();

    if (result.countConducted && result.passed) {
      return {
        [proposalId]: {
          color: "green",
          text: "Passed",
        },
      };
    } else if (result.countConducted && !result.passed) {
      return {
        [proposalId]: {
          color: "red",
          text: "Rejected",
        },
      };
    } else {
      return {
        [proposalId]: {
          color: "blue",
          text: "Ongoing",
        },
      };
    }
  }

  // ? Create Donation
  async function createDonation(donation) {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    const daoVerifier = new ethers.Contract(address, ContractABI, signer);
    // * Gas Calculation

    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: "get",
        url: "https://gasstation-mumbai.matic.today/v2",
      });
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + "",
        "gwei"
      );
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + "",
        "gwei"
      );
    } catch {
      // ignore
    }

    try {
      const donateTxn = await daoVerifier.Donate({
        value: ethers.utils.parseEther(donation),
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000",
      });

      // * wait for 2 confirmations after txn get mined!
      await donateTxn.wait(2);

      const HASH = donateTxn.hash;
      const URL = BaseUrl + HASH;
      setPolygonScan(URL);
      toast.success("Donation Send Succesfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSubDonation(false);
    } catch (error) {
      toast.error("Transaction Failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
   

      setSubDonation(false);
    }
  }

  // ? Create a new proposal
  async function createProposal(description, requiredAmount) {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();


    // * Gas Calculation
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: "get",
        url: "https://gasstation-mumbai.matic.today/v2",
      });
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + "",
        "gwei"
      );
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + "",
        "gwei"
      );
    } catch {
      // ignore
    }

    const daoVerifier = new ethers.Contract(address, ContractABI, signer);

    try {
      const proposalTxn = await daoVerifier.createProposal(
        description,
        ethers.utils.parseEther(requiredAmount),
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
          gasLimit: "1000000",
        }
      );

      // * wait for 2 confirmations after txn get mined!
      await proposalTxn.wait(2);
      const HASH = proposalTxn.hash;
      const url = BaseUrl + HASH;
      setPolygonScan(url);
      toast.success("Proposal Created Succesfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSub(false);
    } catch (error) {
      toast.error("Transaction Failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      

      setSub(false);
    }
  }

  // * For Moralis Configuration (Must be Executed "ONLY ONCE")

  useEffect(() => {
    if (isConnected) {
      async function main() {
        async function configMoralis() {
          let moralisInitialized = await Moralis.Core.isStarted;

          if (!moralisInitialized) {
         
            await Moralis.start({
              apiKey:
                "zLYFqOyS9Mc6G8jzDjx3PEPj8WrcktAYrdyt3QTf2ogr4tU5kUSSE1xsTkF4Idyn",
              // "0KEpH3iOcb7NF49r9hh40AvjYWeFjxfAY15Zf7mzayVEfM9UW1Bt8ZJpcZbV1N2C",
              // ...and any other configuration
            });
          }
        }

        async function getProposals() {
        

          // * Getting ProposalCreated Event
          const Proposal_Created_Event_ABI = {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "requiredAmount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "address",
                name: "proposer",
                type: "address",
              },
            ],
            name: "proposalCreated",
            type: "event",
          };

          const Proposal_Created_Event_TOPIC =
            "0x3ec21697eb8018b62928e5f290d2bccf3af51e8b6cdf71fceab712977647bba9";

          const proposalEventOptions = {
            chain: chain,
            address: address,
            topic: Proposal_Created_Event_TOPIC,
            abi: Proposal_Created_Event_ABI,
          };
          const response = await Moralis.EvmApi.events.getContractEvents(
            proposalEventOptions
          );

          const results = response?.toJSON().result;

          // & Make it ascending for the table
          results.reverse();
          // * Convert uint256 to Ether
          for (let i = 0; i < results.length; i++) {
            results[i].data.requiredAmount = ethers.utils.formatEther(
              results[i].data.requiredAmount
            );
          }

          // * Parse Bad PRoposals
          const parsedProposals = [];
          for (let i = 0; i < results.length; i++) {
            if (results[i].data.requiredAmount > 0.00001) {
              parsedProposals.push(results[i]);
            }
          }

          // * Get Status of the Proposal
          const statusOfAllProposals = [];

          for (let i = 0; i < parsedProposals.length; i++) {
            let currentId = parsedProposals[i].data.uid;

            let statusOfCurrentProposal = await getStatus(currentId);
            statusOfAllProposals.push(statusOfCurrentProposal);
          }

          const table = await Promise.all(
            parsedProposals.map(async (e, index) => [
              e.data.uid,
              e.data.description,
              <div className="flex">
                <div>{e.data.requiredAmount}</div>
                <img
                  style={{ marginLeft: "4px" }}
                  width={"25px"}
                  height={"25px"}
                  src={matic}
                  alt="Logo"
                />
              </div>,
              <Link
                to="/proposal"
                style={{ textDecoration: "none" }}
                state={{
                  description: e.data.description,
                  color: statusOfAllProposals[index][e.data.uid].color,
                  text: statusOfAllProposals[index][e.data.uid].text,
                  id: e.data.uid,
                  proposer: e.data.proposer,
                }}
              >
                <Tag
                  color={statusOfAllProposals[index][e.data.uid].color}
                  text={statusOfAllProposals[index][e.data.uid].text}
                />
              </Link>,
            ])
          );

          table.reverse();
          setProposals(table);
          setTotalP(results.length);
        }

        async function getDaoBalance() {
          const response = await Moralis.EvmApi.balance.getNativeBalance({
            address,
            chain,
          });
          const balanceStr = ethers.utils.formatEther(
            response?.toJSON().balance
          );
          const balance = Number(balanceStr).toFixed(4);

          setDaoBalance(balance);
        }

        async function getUserDonation() {
          const functionName = "addressToDonation";

          const options = {
            abi: ContractABI,
            functionName: functionName,
            address: address,
            chain: chain,
            params: {
              "": userAddress,
            },
          };
          const donationDetails =
            await Moralis.EvmApi.utils.runContractFunction(options);
          const result = donationDetails?.toJSON();

          const donation = ethers.utils.formatEther(result.toString());
          setDonation(donation);
        }

        async function getUserVerify() {
          
          const ownerFunc = "DAOowner";

          const ownerOpt = {
            abi: ContractABI,
            functionName: ownerFunc,
            address: address,
            chain: chain,
          };

          const ownerStatus = await Moralis.EvmApi.utils.runContractFunction(
            ownerOpt
          );
          const ownerAddress = ownerStatus?.toJSON();
    
          if (ownerAddress === userAddress) {
            setIsOwner(true);
            setIsMember(true)
            return true
            
          } else {
            const functionName = "isMember";

            const options = {
              abi: ContractABI,
              functionName: functionName,
              address: address,
              chain: chain,
              params: {
                "": userAddress,
              },
            };
            const statusRaw = await Moralis.EvmApi.utils.runContractFunction(
              options
            );
            const status = statusRaw?.toJSON();
              // console.log(status)
            setIsMember(true);
            return true
          }
        }

        async function getPassRate() {
          // * Getting ProposalCount Event
          const countEventABI = {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "passed",
                type: "bool",
              },
            ],
            name: "proposalCount",
            type: "event",
          };

          const topic =
            "0x4556fcf667ee704924eea359363d28f06708b744ad113340982b07ef9919fb91";

          const EventOptions = {
            chain: chain,
            address: address,
            topic: topic,
            abi: countEventABI,
            // fromBlock: 16162627
          };

          const responseEvents = await Moralis.EvmApi.events.getContractEvents(
            EventOptions
          );
          const eventArray = responseEvents?.toJSON().result;

        

          let won = 0;
          //   * Getting Proposal Details
          for (let i = 0; i < eventArray.length; i++) {
            if (eventArray[i].data.passed === true) {
              won++;
            }
          }
          const passRateRaw = (won / eventArray.length) * 100;
          const passRate = passRateRaw.toFixed(0);
          setPassRate(passRate);
        }

        
        setLoading(true);
        await configMoralis();

        
        
        if (await getUserVerify()) {

          await getUserDonation();
          await getDaoBalance();

          await getProposals();
          await getPassRate();
          setLoading(false);
          
          
        }
      }
      main();
    }
  }, [isConnected, isMember, userAddress, sub, subDonation]);

  return (
    <>
      <ToastContainer closeButton={CloseButton} />
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="DAO">
            <div className="tabContent">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "-30px",
                }}
              >
                {!isMember && !isOwner && (
                  <Link style={{ textDecoration: "none" }} to="/qr">
                    <Button text="Please Verify" theme="primary" size="large" />
                  </Link>
                )}

                {isConnected && isOwner && (
                  <Link
                    style={{ textDecoration: "none", marginLeft: "30px" }}
                    to="/owner"
                  >
                    <Tag
                      color="purple"
                      onCancelClick={function noRefCheck() {}}
                      text="Owner Panel"
                      tone="dark"
                      fontSize="20px"
                      style={{ padding: "15px", marginRight: "5px" }}
                    />
                  </Link>
                )}

                {isConnected && isOwner ? (
                  <Tag
                    color="green"
                    text="DAO Owner"
                    fontSize="25px"
                    tone="dark"
                    width="fit-content"
                    style={{ padding: "10px 15px", marginLeft: "20px" }}
                  />
                ) : (
                  isConnected &&
                  isMember && (
                    <Tag
                      color="purple"
                      text="Verified Member"
                      fontSize="25px"
                      tone="dark"
                      width="fit-content"
                      style={{ padding: "10px 15px" }}
                    />
                  )
                )}
              </div>
              <Tag
                      color="purple"
                      text="Shadow DAO"
                      fontSize="25px"
                      // tone="dark"
                      width="fit-content"
                      style={{ padding: "15px 15px" }}
                    /> 
              <div className="widgets">
                <Widget
                  isLoading={isDisconnected || isLoading}
                  info={totalP}
                  title="Proposals Created"
                  style={{ width: "200%" }}
                >
                  {!isLoading && isConnected && isMember && (
                    <div className="extraWidgetInfo">
                      <div className="extraTitle">Pass Rate</div>
                      <div className="progress">
                        <div
                          className="progressPercentage"
                          style={{ width: `${passRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Widget>

                <Widget
                  isLoading={isDisconnected || isLoading}
                  info={daoBalance}
                  title="DAO Treasury Balance"
                >
                  <img
                    style={{ marginTop: "30px" }}
                    width={"25px"}
                    height={"25px"}
                    src={matic}
                    alt="Logo"
                  />
                </Widget>

                <Widget
                  isLoading={isDisconnected || isLoading}
                  info={donation}
                  title="Your Donations:"
                />
              </div>
              <div>
                {isMember && isConnected && !sub && (
                  <Form
                    isDisabled={isLoading}
                    buttonConfig={{
                      isLoading: sub,
                      loadingText: "Submitting Proposal",
                      text: "Submit",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Description",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                      {
                        inputWidth: "20%",
                        name: "Required Amount",
                        type: "number",
                        validation: {
                          characterMaxLength: 5,
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      try {
                        setSub(true);
                        createProposal(
                          e.data[0].inputResult,
                          e.data[1].inputResult
                        );
                        // e.preventDefault();
                      } catch (error) {
                   
                      }
                    }}
                    title="Create a New Proposal"
                  />
                )}

                {/* Substitue Form */}
                {sub && (
                  <Form
                    isDisabled={true}
                    buttonConfig={{
                      text: "Submitting...",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Description",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                      {
                        inputWidth: "20%",
                        name: "Required Amount",
                        type: "number",
                        validation: {
                          characterMaxLength: 5,
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      try {
                        setSub(true);
                        createProposal(
                          e.data[0].inputResult,
                          e.data[1].inputResult
                        );
                        // e.preventDefault();
                      } catch (error) {
                 
                      }
                    }}
                    title="Create a New Proposal"
                  />
                )}
              </div>
              <div style={{ marginTop: "30px" }}>
                <div
                  style={{
                    color: "#68738D",
                    marginBottom: "20px",
                    marginTop: "30px",
                    alignContent: "center",
                  }}
                >
                  Recent Proposals
                </div>
                <Table
                  isLoading={isDisconnected || isLoading}
                  id={1}
                  columnsConfig="10% 50% 20% 20%"
                  data={proposals}
                  header={[
                    <span>ID</span>,
                    <span>Description</span>,
                    <span>Required Amount </span>,
                    <span>Status</span>,
                  ]}
                  pageSize={6}
                />
              </div>
            </div>

            <div></div>
          </Tab>
          <Tab tabKey={2} tabName="Fund DAO">
            <div className="DAO">
              <Widget
                isLoading={isDisconnected || isLoading}
                info={donation}
                title="Your Donations:"
              />
            </div>
            {isMember && isConnected && !subDonation && (
              <Form
                isDisabled={isLoading}
                buttonConfig={{
                  isLoading: subDonation,
                  loadingText: "Sending...",
                  text: "FUND",
                  theme: "secondary",
                }}
                data={[
                  {
                    inputWidth: "20%",
                    name: "Amount you wana FUND",
                    type: "number",
                    validation: {
                      characterMaxLength: 5,
                      required: true,
                    },
                    value: "",
                  },
                ]}
                onSubmit={(e) => {
                  setSubDonation(true);
                  createDonation(e.data[0].inputResult);
                }}
                title="FUND OUR DAO"
              />
            )}

            {/* Substitue Form */}
            {subDonation && (
              <Form
                isDisabled={true}
                buttonConfig={{
                  text: "Sending...",
                  theme: "secondary",
                }}
                data={[
                  {
                    inputWidth: "20%",
                    name: "Amount you wana FUND",
                    type: "number",
                    validation: {
                      characterMaxLength: 5,
                      required: true,
                    },
                    value: "",
                  },
                ]}
                onSubmit={(e) => {
                  setSubDonation(true);
                  createDonation(e.data[0].inputResult);
                }}
                title="FUND OUR DAO"
              />
            )}
          </Tab>
          <Tab tabKey={3} tabName="Docs"></Tab>
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Home;
