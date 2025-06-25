import React, { useState, useEffect } from "react";

import JC_Policy from '../Components/PolicyCheck/JC_Policy';

import AgentCRO_Header from '../Components/AgentCRO/AgentCRO_Header';

import Claim_Head_Header from '../Components/Claim_Head_Component/Claim_Head_Header';
import Key_Account_Manager_Header from '../Components/Key_Account_Manager_Header';

const CheckPolicy = () => {
    const [userData, setUserData] = useState(null);

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
                <JC_Policy />
            </div>
        );
    } else if (userData && userData.userRole === "Key_Account_Manager") {
        return (
            <div className="container-fluid">
                <Key_Account_Manager_Header />

                <JC_Policy />
            </div>
        );
    } else if (userData && userData.userRole === "AgentCRO") {
        return (
            <div className="container-fluid">
                <AgentCRO_Header />

                <JC_Policy />
            </div>
        );
    }

    return null;
};

export default CheckPolicy;
