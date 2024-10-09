import React from "react";
import logo from "../assets/download.png";

const AuthLayout = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center py-2 h-15 shadow-md hidden bg-white">
        <img src={logo} alt="logo" width={50} height={10} />
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
