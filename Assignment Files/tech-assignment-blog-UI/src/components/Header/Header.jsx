import React from "react";
import TrueCallerLogo from "../../Assets/logotype/truecaller.svg";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={TrueCallerLogo} alt="Truecaller logo" className="logo" />
        <div className="banner-text">the truecaller blog</div>
      </div>
    </header>
  );
};

export default Header;
