import React from "react";
import { useKeycloak } from "@react-keycloak/web";

const Signup = () => {
  const { keycloak } = useKeycloak();
  const Log = () => {
    keycloak.login();
  };
  return (
    <div>
      <div className="sing-log-wrap">
        <div className="p-3">
          <img className="" src="/images/logo.png" />
        </div>
        <div className="signup-area">
          <div className="container">
            <div className="row">
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <div className="form-area">
                  <div className="form-sing">
                    <div className="mb-4">
                      <h4 className="mb-2">Welcome</h4>
                      <p>Please sign in and get sterted</p>
                    </div>
                    <div className="">
                      <div action="">
                        <div className="form-bor">
                          <h4>Login With Comviva</h4>
                          {/* <div className="form-input-group">
                                                        <label htmlFor="">Username</label>
                                                        <input type="text" name="username" />
                                                    </div>

                                                    <div className="form-input-group">
                                                        <label htmlFor="">Password</label>
                                                        <input type="password" name="password" />
                                                    </div>
                                                    <div className="form-input-checkbox">
                                                        <input className="me-2" type="checkbox" id="test1" />
                                                        <label htmlFor="test1">Keep me Signed in</label>
                                                    </div> */}
                          <div className="form-input-group">
                            <button onClick={Log}>Sign In</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
