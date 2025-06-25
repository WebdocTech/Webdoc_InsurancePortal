
import React, { useState, useEffect } from "react";
import ChangeinProduct from '../Components/Products/ChangeinProduct';  
import ClaimHeadHeader from '../Components/Claim_Head_Component/Claim_Head_Header'; // Update the import to PascalCase
import KeyAccountManagerHeader from '../Components/Key_Account_Manager_Header'; // Update the import to PascalCase

const ProductEdit = () => {
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
                <ClaimHeadHeader /> 
                <ChangeinProduct />
            </div>
        );
    } else if (userData && userData.userRole === "Key_Account_Manager") {
        return (
            <div className="container-fluid">
                <KeyAccountManagerHeader />
                <ChangeinProduct />
            </div>
        );
    } 

    return null; 
};

export default ProductEdit;
