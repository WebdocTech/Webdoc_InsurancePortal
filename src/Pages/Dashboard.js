import React, { useState, useEffect } from "react";
import Dashboard_Report from "../Components/Claim_Head_Component/Dashboard_Report"; // Import the new ClaimsDashboard component
import JazzDashboard_Report from "../Components/Key_Account_Manager_COMP/Dashboard_Report"; // Import the new ClaimsDashboard component
import AgentCRO_Header from "../Components/AgentCRO/AgentCRO_Header";
import Claim_Head_Header from "../Components/Claim_Head_Component/Claim_Head_Header";
import Key_Account_Manager_Header from "../Components/Key_Account_Manager_Header";
import SearchInsuranceCustomer from "../Components/AgentCRO/SearchInsuranceCustomer"; // Adjust this path based on your project structure

import FinancePendingClaims from "../Components/Finance/FinancePendingClaims"; // Adjust this path based on your project structure
import HeaderFinance from "../Components/Finance/HeaderFinance";

const ClaimHead_Dashboard = () => {
  const [userData, setUserData] = useState(null); // Store user data

  // Load user data from sessionStorage on component mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserData(user);
    } else {
      console.log("No user found in sessionStorage");
    }
  }, []);

  // Check if userData is available and if the role is "Claim_Head"
  if (userData && userData.userRole === "Claim_Head") {
    return (
      <div className="container-fluid">
        <Claim_Head_Header />
        <Dashboard_Report />
      </div>
    );
  } else if (userData && userData.userRole === "Key_Account_Manager") {
    return (
      <div className="container-fluid">
        <Key_Account_Manager_Header />
        <JazzDashboard_Report />
      </div>
    );
  } else if (userData && userData.userRole === "Finance") {
    return (
      <div className="container-fluid">
        <HeaderFinance />
        <FinancePendingClaims />
      </div>
    );
  } else if (userData && userData.userRole === "AgentCRO") {
    return (
      <div className="container-fluid">
        <AgentCRO_Header />
        <SearchInsuranceCustomer />
      </div>
    );
  } else if (userData && userData.userRole === "InsuranceFront") {
    return (
      <div className="container-fluid">
        <HeaderFinance />
        <FinancePendingClaims />
      </div>
    );
  }
};

export default ClaimHead_Dashboard;
