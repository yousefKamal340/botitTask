import React from "react";

const Landing = () => {
  const gradientStyle = {
    background: "linear-gradient(135deg, #292929, #563d7c)",
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };
  return (
    <div style={gradientStyle}>
      <p
        style={{
          color: "#FFFFFF",
          fontFamily: "fantasy",
          fontSize: "40px",
          fontStyle: "italic",
          transform: "translateY(-30vh)"
        }}
      >
        Welcome To E-Wallet
      </p>
    </div>
  );
};

export default Landing;
