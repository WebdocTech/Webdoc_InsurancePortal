import React, { useState, useEffect } from "react";

import Claim_Approval from "../Components/Claim_Head_Component/Claim_Approval";

import Claim_Head_Header from '../Components/Claim_Head_Component/Claim_Head_Header';

const Claim_ApprovalPending = () => {
    const [userData, setUserData] = useState(null); // Store user data

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            setUserData(user);
        } else {
            console.log("No user found in sessionStorage");
        }
    }, []);

    if (userData && userData.userRole === "Claim_Head") {
        return (
            <div className="container-fluid">
                <Claim_Head_Header />
                <Claim_Approval />
            </div>
        );
    } 

    return null; 
};

export default Claim_ApprovalPending;
