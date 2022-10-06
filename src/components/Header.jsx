import React, { useState, useRef } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { FaUserTie, FaChevronDown } from "react-icons/fa";
import useOnClickOutside from "./useClickOutSide";

// Logo
import Logo from "../Images/logo.png";
const HeaderNav = () => {
  const ref = useRef();
  const { keycloak } = useKeycloak();
  const [popup, setPopup] = useState(false);
  const logout = () => {
    keycloak.logout();
    localStorage.clear();
    window.location.reload();
  };
  useOnClickOutside(ref, () => setPopup(false));
  const handlePopup = () => {
    setPopup(!popup);
  };

  return (
    <>
      <header className="header" id="header">
        <div>
          {" "}
          <span className="nav_logo-name">
            <img src={Logo} alt="logo" />
          </span>{" "}
        </div>

        {/* Dropdown */}
        <div style={{ position: "relative" }}>
          <span onClick={handlePopup} id="userName">
            <div style={{ textTransform: "capitalize" }} className="">
              {keycloak.hasOwnProperty("tokenParsed") &&
                keycloak.tokenParsed.name}{" "}
              <FaChevronDown style={{ color: "black", fontSize: "14px" }} />
            </div>
            {/* <div className="header-icon">
              <FaUserTie />
            </div> */}
          </span>

          {popup && (
            <div ref={ref} id="drop-box">
              {/* <div id="user">{keycloak && keycloak.tokenParsed.name}</div> */}

              <div className="form-input-group">
                <button id="btn" onClick={logout}>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderNav;
