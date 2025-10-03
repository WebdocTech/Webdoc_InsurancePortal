import React from "react";

const ComingSoon = () => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#282c34",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#61dafb",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        textAlign: "center",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontSize: "5rem",
          marginBottom: "10px",
          animation: "bounce 2s infinite",
        }}
      >
        🚀 Coming Soon! 🚀
      </h1>
      <p
        style={{
          fontSize: "1.5rem",
          marginBottom: "40px",
          color: "#fff",
          animation: "shake 0.8s infinite",
        }}
      >
        We're cooking up something amazing — stay tuned! 🍕🎉
      </p>

      {/* Funny bouncing rocket */}
      <div
        style={{
          fontSize: "6rem",
          animation: "rocketFly 3s ease-in-out infinite",
          transformOrigin: "bottom center",
        }}
      >
        🚀
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20%, 60% { transform: rotate(15deg); }
          40%, 80% { transform: rotate(-15deg); }
        }

        @keyframes rocketFly {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-40px) rotate(10deg); }
          50% { transform: translateY(-80px) rotate(-10deg); }
          75% { transform: translateY(-40px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
