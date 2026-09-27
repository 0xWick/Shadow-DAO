import React from "react";
import "./pages.css";
import { Link } from "react-router-dom";
import { Button, NFT } from "web3uikit";
import memberQr from "../images/member.png";
import ownerQr from "../images/owner-qr.png";

const qrVerification = () => {
  return (
    <>
      <div className="contentProposal">
        <div className="qr-flex ">
        <div className="margin-30 btn_margin">
            <Link style={{ textDecoration: "none" }} to="/">
              <Button
                onClick={function noRefCheck() {}}
                text="I am Verified"
                theme="primary"
                size="large"
              />
            </Link>
          </div>
          <div className="flex qr_margin">

            
            <div className="margin-30">
              <h3 style={{ color: "White", textAlign: "center" }}>
                Owner Verification
              </h3>
              <img src={ownerQr} />
            </div>
            <div className="margin-30">
              <h3 style={{ color: "White", textAlign: "center" }}>
                Member Verification
              </h3>
              <img src={memberQr} />
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default qrVerification;
