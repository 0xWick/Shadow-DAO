import "./pages.css";
import React, { useState } from "react";

import { Form, Button } from "web3uikit";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ContractAddress, ContractABI} from "./config.js";

const Owner = () => {
  // * Function for POLYGONSCAN
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

  // * State Management
  const [withdrawLoading, setWithDrawLoading] = useState(false);
  // * State for PolygonScan Management
  const [polygonScan, setPolygonScan] = useState("");

  // * State for New Member
  const [subNewMember, setSubNewMember] = useState(false);

  // * State for Revoke Member
  const [subRevokeMember, setSubRevokeMember] = useState(false);
  // * Using Wagmi Hook
  const { isConnected } = useAccount();

  // * BASE URL
  const BaseUrl = "https://mumbai.polygonscan.com/tx/";

  // * Setup Chain & Contract Address
  const address = ContractAddress;

  async function withDrawFunds() {
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
      const donateTxn = await daoVerifier.withdrawAll({
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000",
      });
      await donateTxn.wait(2);
      const HASH = donateTxn.hash;
      const URL = BaseUrl + HASH;
      setPolygonScan(URL);
      toast.success("WithDrawl is Succesfull", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setWithDrawLoading(false);
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
    

      setWithDrawLoading(false);
    }
  }

  async function createNewMember(userPID) {
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
      const donateTxn = await daoVerifier.newMembership(userPID, {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000",
      });
      await donateTxn.wait(2);
      const HASH = donateTxn.hash;
      const URL = BaseUrl + HASH;
      setPolygonScan(URL);
      toast.success("New Membership Succesfull", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSubNewMember(false);
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


      setSubNewMember(false);
    }
  }

  async function rewokeMember(revokeAddress) {
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
      const donateTxn = await daoVerifier.revokeMembership(revokeAddress, {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000",
      });
      await donateTxn.wait(2);
      const HASH = donateTxn.hash;
      const URL = BaseUrl + HASH;
      setPolygonScan(URL);
      toast.success("Membership Revoked Succesfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSubRevokeMember(false);
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
      

      setSubRevokeMember(false);
    }
  }

  return (
    <>
      <ToastContainer closeButton={CloseButton} />
      <div className="contentProposal">
        <div className="qr-flex ">
          <div className="flex qr_margin">
            <Button
              onClick={withDrawFunds}
              text="Withdraw"
              theme="primary"
              size="large"
              disabled={withdrawLoading}
            />

            <div className="margin-30">
              <div>
                {isConnected && !subNewMember && (
                  <Form
                    // isDisabled={}
                    buttonConfig={{
                      isLoading: subNewMember,
                      loadingText: "Sending...",
                      text: "New Membership",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the User PID",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubNewMember(true);
                      createNewMember(e.data[0].inputResult);
                    }}
                    title="New MemberShip"
                  />
                )}

                {/* Substitue Form */}
                {subNewMember && (
                  <Form
                    isDisabled={true}
                    buttonConfig={{
                      text: "Assigning...",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the User PID",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubNewMember(true);
                      createNewMember(e.data[0].inputResult);
                    }}
                    title="New MemberShip"
                  />
                )}
              </div>
            </div>

            <div className="margin-30">
              <div>
                {isConnected && !subRevokeMember && (
                  <Form
                    // isDisabled={}
                    buttonConfig={{
                      isLoading: subRevokeMember,
                      loadingText: "Sending...",
                      text: "Rewoke Membership",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the Address",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubRevokeMember(true);
                      rewokeMember(e.data[0].inputResult);
                    }}
                    title="Revoke MemberShip"
                  />
                )}

                {/* Substitue Form */}
                {subRevokeMember && (
                  <Form
                    isDisabled={true}
                    buttonConfig={{
                      text: "Rewoking membership...",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the Address",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubRevokeMember(true);
                      rewokeMember(e.data[0].inputResult);
                    }}
                    title="Revoke MemberShip"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Owner;
