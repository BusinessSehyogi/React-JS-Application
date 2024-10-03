import React, { useEffect, useState } from 'react';

import './login.css';
import logo from '../Images/logo-no-background.png';
import { useNavigate } from "react-router-dom";
import { globalVariable } from './globalVariables';

function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('Token'); // Change localStorage to sessionStorage
    if (token) {
      navigate('/'); // Redirect to home if token exists
    }
  }, [navigate]);

  async function handleClick(event) {
    event.preventDefault();
    const url = `http://${globalVariable.value}/login/${formData.email}`;

    let response = await fetch(url, {
      method: 'GET',
    });
    
    const data = await response.json();
    console.log("The user data is", data.userName);
    console.log("Your login data is", data);

    if (formData.password === data.password) {
      console.log(data["userName"])
      sessionStorage.setItem('Token', data["userId"]); // Change localStorage to sessionStorage
      sessionStorage.setItem('Name', data["userName"]); // Change localStorage to sessionStorage
      console.log(sessionStorage.getItem('Token')); // Change localStorage to sessionStorage
      navigate('/');
    } else {
      alert("Please check your password and username");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    // console.log(name, value);
  }

  const clickButton = () => {
    navigate("/signup");
  }

  return (
    <div className='login-page'>
      <div className='logo'>
        <img src={logo} className='logo-image' alt="Logo" />
      </div>
      <div className='username'>
        <input className='username-login' name='email' type="text" value={formData.email} placeholder='Enter Your Username or Email' onChange={handleChange} />
        <input className='password-login' name='password' value={formData.password} placeholder='Enter Your Password' type='password' onChange={handleChange} />
        <div className='login-submit'>
          <button className='login-button' type='submit' id='button-submit' onClick={handleClick}>Login</button>
          <div className='simple-div'>
            <button className='link-forgot'>Forget Password?</button>
            <button className='link-account' onClick={clickButton}>Create a new Account?</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
