import React, { useState, useEffect } from "react";

import Key_Account_Manager_Product from '../Components/Key_Account_Manager_COMP/Key_Account_Manager_Product'; // Adjust this path based on your project structure
import Claim_Head_Products from '../Components/Claim_Head_Component/Claim_Head_Products'; // Adjust this path based on your project structure
import AgentCRO_Header from '../Components/AgentCRO/AgentCRO_Header';
import Claim_Head_Header from '../Components/Claim_Head_Component/Claim_Head_Header';
import Key_Account_Manager_Header from '../Components/Key_Account_Manager_Header';

const Product = () => {
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
                <Claim_Head_Products />
            </div>
        );
    } else if (userData && userData.userRole === "Key_Account_Manager") {
        return (
            <div className="container-fluid">
                <Key_Account_Manager_Header />
              
                <Key_Account_Manager_Product />
            </div>
        );
    } else if (userData && userData.userRole === "AgentCRO") {
        return (
            <div className="container-fluid">
                <AgentCRO_Header />

                <Claim_Head_Products />
            </div>
        );
    }

    return null; // Return null if the user role is not found
};

export default Product;
