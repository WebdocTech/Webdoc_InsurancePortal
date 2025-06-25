import React, { useState, useEffect } from "react";

import Key_Account_Manager_Report from '../Components/Key_Account_Manager_COMP/Key_Account_Manager_Report'; // Adjust this path based on your project structure
import Claim_Report from '../Components/Claim_Head_Component/Claim_Report'; // Adjust this path based on your project structure

import Claim_Head_Header from '../Components/Claim_Head_Component/Claim_Head_Header';
import Key_Account_Manager_Header from '../Components/Key_Account_Manager_Header';

const Report = () => {
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
                <Claim_Report />
            </div>
        );
    } else if (userData && userData.userRole === "Key_Account_Manager") {
        return (
            <div className="container-fluid">
                <Key_Account_Manager_Header />

                <Key_Account_Manager_Report />
            </div>
        );
    }

    return null; // Return null if the user role is not found
};

export default Report;
