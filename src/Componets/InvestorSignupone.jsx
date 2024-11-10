import React, { useState } from 'react';
import logo from '../Images/logo-no-background.png';
import { useNavigate } from "react-router-dom";
import { globalVariable } from './globalVariables';
import './signup.css';

const InvestorSignupone = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    async function handleClick(event) {
        event.preventDefault(); // Prevent default form submission

        // You can uncomment and modify this fetch logic when needed
        /*
        const url = http://${globalVariable.value}/registerUser;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 0,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password, // Ensure to capture this properly if needed
                category: sessionStorage.getItem("UserType"),
                visible: true,
                emailVerified: false,
                contactnoVerified: false
            }),
        });
        
        const data = await response.json();
        if (response.status === 200) {
            alert('Registration is successful');
            navigate("/InvestorSignuptwo");
        } else {
            alert("Already registered");
        }
        */

        // Set session storage values
        sessionStorage.setItem('FirstName', formData.firstName);
        sessionStorage.setItem('LastName', formData.lastName);
        sessionStorage.setItem('PhoneNo', formData.phone);
        sessionStorage.setItem('Email', formData.email);
        navigate("/InvestorSignuptwo");
    }

    return (
        <div className='home'>
            <div className='row'>
                {/* <div id="header" className='col-md-1 d-flex'>
                    <div id="logo-homepage">
                        <img src={logo} alt="Logo" />
                    </div>
                </div>
                <div className="text col-md-1">Home</div>
                <div className="text col-md-1">About</div>
                <div className="text col-md-1">Founder</div>
                <div className="text col-md-1">Investor</div>
                <div className="text col-md-3">Review</div>
                {/* Conditionally render buttons based on username */}
                {/* <button className='home-Register col-md-1'>{username ? "Logout" : "Sign Up"}</button>
                <button className='home-signup col-md-1'>{username ? "" : "Login"}</button> */} 
            </div>

            <div className='input-container-Investor'>
                <div className='cont-input-Investor'>
                    <input
                        type='text'
                        name='firstName'
                        placeholder='First Name'
                        value={formData.firstName}
                        className='founder-signup-field'
                        onChange={handleChange}
                    />
                    <input
                        type='text'
                        name='lastName'
                        placeholder='Last Name'
                        value={formData.lastName}
                        className='founder-signup-field'
                        onChange={handleChange}
                    />
                    <input
                        type='text'
                        name='phone'
                        placeholder='Phone no'
                        value={formData.phone}
                        className='founder-signup-field'
                        onChange={handleChange}
                    />
                    <input
                        type='email' // Use type email for better validation
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        className='founder-signup-field'
                        onChange={handleChange}
                    />
                    <div>
                        <button className='signup-investor-button' onClick={handleClick}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvestorSignupone;