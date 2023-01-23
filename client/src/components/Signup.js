import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup(props) {

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const navigate = useNavigate();

  // this will return authtoken on valid login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
    });
    const json = await response.json(); //will get authtoken and success msg
    console.log(json);
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem('token', json.authtoken);
      localStorage.setItem('name', json.user.name);
      navigate('/');
      props.showAlert("Acount Created Successfully", "success");

    }
    else {
      props.showAlert(json.error, "danger");
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <>
      <h2 className='mt-4 mb-3 text-center'>Create an account to continue</h2>
      <form onSubmit={handleSubmit} className="myForm">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Enter Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onChange} required minLength={4} />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} required minLength={4} />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </>
  )
}

export default Signup;
