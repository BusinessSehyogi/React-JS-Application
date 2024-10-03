import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { globalVariable } from './globalVariables';
import './signup.css'; // Ensure this CSS file is created and linked

function Signup({ onClose }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [UserType, setUserType] = useState('Founder');

    const handleClick = async (event) => {
        event.preventDefault();
        let url = `http://${globalVariable.value}/registerUser`;
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": 0,
                "firstName": formData.firstName,
                "lastName": formData.lastName,
                "userName": formData.userName,
                "email": formData.email,
                "password": formData.password,
                "category": UserType,
                "visible": true,
                "emailVerified": false,
                "contactnoVerified": false
            }),
        });

        if (response.status === 200) {
            alert('Registration is successful');
            onClose(); // Close the modal on success
            navigate("/"); // Navigate to home or another page
        } else {
            alert("Already registered");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleUserTypeSelection = (type) => {
        setUserType(type);
    };

    return (
        <div className='signup-page'>
            {/* "Go Back" button outside the signup box */}
            <button className='go-back-button' onClick={onClose}>Go Back</button>

            <div className='signup-modal'>
                <div className='modal-content'>
                    <h2 className='modal-title'>Sign Up</h2>
                    <div className='user-type-selection'>
                        <button
                            className={`user-type-btn ${UserType === 'Founder' ? 'active' : ''}`}
                            onClick={() => handleUserTypeSelection('Founder')}
                        >
                            Founder
                        </button>
                        <button
                            className={`user-type-btn ${UserType === 'Investor' ? 'active' : ''}`}
                            onClick={() => handleUserTypeSelection('Investor')}
                        >
                            Investor
                        </button>
                    </div>
                    <form className='signup-form' onSubmit={handleClick}>
                        <div className='name-inputs'>
                            <input
                                type="text"
                                name='firstName'
                                value={formData.firstName}
                                placeholder='Enter Your First Name'
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name='lastName'
                                value={formData.lastName}
                                placeholder='Enter Your Last Name'
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            type="text"
                            name='userName'
                            value={formData.userName}
                            placeholder='Select Username'
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            placeholder='Enter Your Email'
                            onChange={handleChange}
                        />
                        <input
                            placeholder='Enter Your Password'
                            name='password'
                            value={formData.password}
                            type='password'
                            onChange={handleChange}
                        />
                        <input
                            placeholder='Confirm Your Password'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            type='password'
                            onChange={handleChange}
                        />
                        <button className='signup-button' type='submit'>Sign Up</button>
                        <button className='link-account' onClick={onClose}>Already have an account?</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
