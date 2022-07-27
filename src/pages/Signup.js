import React, { useEffect } from "react";
import Table from 'react-bootstrap/Table';

const Signup = () => {
  return (
    <div>
          <div className="sing-log-wrap">
            <div className="p-3">
                <img className="" src='/images/logo.png' />
            </div>
            <div className="signup-area">
                <div className="container">
                <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                        <div className="form-area">
                            <div className="form-sing">
                            <h4 className="mb-3">Sign In</h4>
                                <div className="">
                                    <form action="">
                                        <div className="form-bor">
                                            <div className="form-input-group">
                                                <label for="">Username</label>
                                                <input type="text" name="username"/>
                                            </div>

                                            <div className="form-input-group">
                                                <label for="">Password</label>
                                                <input type="password" name="password"/>
                                            </div>
                                            <div className="form-input-checkbox">
                                                <input className="me-2" type="checkbox" id="test1" />
                                                <label for="test1">Keep me Signed in</label>
                                            </div>
                                            <div className="form-input-group">
                                                <button>Sign In</button>
                                            </div>
                                        </div>
                                    </form>
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
