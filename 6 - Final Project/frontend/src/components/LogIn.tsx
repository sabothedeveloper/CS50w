import React, { useState, useContext } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";

const LogIn: React.FC = () => {
  const { loginUser, errorLogIn } = useContext(AuthContext);


  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser(e); // Call the loginUser function from the AuthContext
  };

    return(
        <div className="container">
            {errorLogIn !== null &&
                Object.keys(errorLogIn).map((fieldName) => (
                <div key={fieldName} className="text-danger text-center">
                    <p>{errorLogIn[fieldName]}</p>
                </div>
                ))}
            <h1 className="text-center display-4 font-bold">Welcome at AppliGate!</h1>
            <div className="row justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6">
                    <form onSubmit={handleForm}>
                    <div className="mb-3">
                        <label htmlFor="login" className="form-label">
                        Login:
                        </label>
                        <input
                        name="login"
                        type="text"
                        required
                        className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                        Password:
                        </label>
                        <input
                        name="password"
                        type="password"
                        required
                        className="form-control"
                        />
                    </div>
                    <div className="d-grid py-2 text-center">
                        <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        >
                        Log In
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="mb-0">Don't have an account? <Link to="/register" className="text-purple-500">Create it Here!</Link></p>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LogIn;