import React, { useState, useContext } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";



const SignUp: React.FC = () =>{

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [err, setErr] = useState<{ [key: string]: string[] } | null>(null);
    const navigate = useNavigate();
    const { signupUser, errorSignUp } = useContext(AuthContext)

    const handlePassword = (e:string) =>{
        setPassword(e)
    }
    const handleConfirm = (e:string) =>{
        setConfirm(e)
    }
    const handleForm = (e: React.FormEvent<HTMLFormElement>) =>{
        setErr({})
        if (password === confirm){
            signupUser(e)
            setErr({})
        }
        else{
            setErr({
                confirm: ['Passwords are not the same']
              });
        }
        
        e.preventDefault()
    }

    return(
        <div className="container">
            
            {/* {err && <p className="text-danger text-center ">{err}</p>} */}
            <div className="container">
                <div className="text-center">   
                    {errorSignUp && errorSignUp.error && (
                        <span className="text-danger">{errorSignUp.error[0]}</span>
                        )}
                </div>
                
            </div>
            <h1 className="text-center display-4">Welcome at AppliGate!</h1>
            <div className="row justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6">
                <form onSubmit={e => handleForm(e)}>
                    <div className="mb-3">   
                    <label htmlFor="login" className="form-label">Login:</label>
                    
                    <div className="">
                        <input 
                        name="login" 
                        type="text" 
                        // onChange={data => handleLogin(data.target.value)} 
                        required
                        placeholder="account1"
                        className={`form-control ${errorSignUp && errorSignUp.username && 'is-invalid'}`} 
                        />
                    </div>
                    {errorSignUp && errorSignUp.username && (
                                <span className="text-danger">{errorSignUp.username[0]}</span>
                                )}
                    </div>
                    
                    <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <div className="">
                        <input 
                        name="password" 
                        type="password" 
                        onChange={data => handlePassword(data.target.value)} 
                        required
                        className="form-control"
                        />
                    </div>
                    </div>

                    <div className="mb-3">
                    <label htmlFor="confirm" className="form-label">Confirm Password:</label>
                    <div className="">
                        <input 
                        name="confirm" 
                        type="password" 
                        onChange={data => handleConfirm(data.target.value)} 
                        required
                        className={`form-control ${err && err.confirm && 'is-invalid'}`}
                        />
                    </div>
                    {err && err.confirm && (
                                <span className="text-danger">{err.confirm[0]}</span>
                                )}
                    </div>

                    <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <div className="">
                        <input 
                        name="email" 
                        type="email" 
                        // onChange={data => handleEmail(data.target.value)} 
                        required
                        placeholder="example@test.com"
                        className={`form-control ${errorSignUp && errorSignUp.email && 'is-invalid'}`}
                        />
                    </div>
                    {errorSignUp && errorSignUp.email && (
                                <span className="text-danger">{errorSignUp.email[0]}</span>
                                )}
                    </div>

                    <div className="d-grid py-2 text-center">
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block"
                    >
                        Sign Up
                    </button>      
                    </div>

                    <div className="mb-3 text-center">
                    <p className="">Already have an account? <Link to="/login" className="">Log In Here!</Link></p>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}
export default SignUp;