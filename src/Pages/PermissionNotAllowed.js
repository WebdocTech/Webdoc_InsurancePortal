import React from "react";

const PermissionNotAllowed = () => (
  <div
    style={{
      display: "flex",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: "#f44336",
      color: "white",
      fontWeight: "bold",
      fontSize: "3rem",
      textAlign: "center",
      padding: "20px",
    }}
  >
    <p>🚫 Access Denied</p>
    <p>You do not have permission to view this page.</p>
  </div>
);

export default PermissionNotAllowed;
