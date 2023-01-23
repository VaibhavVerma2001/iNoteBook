import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';

const Login = (props) => {

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const context = useContext(NoteContext);
    const {setUser} = context;


    // this will return authtoken on valid login
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        console.log(json);
        if (json.success) {
            setUser(json.user);
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            localStorage.setItem('name', json.user.name);
            props.showAlert("Logged In Successfully", "success");
            navigate('/');

        }
        else {
            props.showAlert("Invalid credentials", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <>
            <h2  className='mt-4 mb-3 text-center'>Login to continue</h2>
            <form onSubmit={handleSubmit} className="myForm">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" name="email" className="form-control" id="email" onChange={onChange} value={credentials.email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} value={credentials.password} />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </>
    )
}

export default Login;
