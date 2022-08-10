import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
const HeaderNav = () => {
  const { keycloak } = useKeycloak()
  const logout = () => {
    keycloak.logout();
    // localStorage.removeItem('token')
  }
  return (
    <>
      <header className="header" id="header">
        <div>  <span className="nav_logo-name">
          <img src="/images/logo.png" alt="" />
        </span> </div>
        <div className="form-input-group">
          <button style={{ marginTop: "0px" }} onClick={logout}>Log Out</button>
        </div>
      </header>
    </>
  );
};

export default HeaderNav;