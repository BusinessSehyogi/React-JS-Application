import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { globalVariable } from './globalVariables';
import './signup.css';

function FounderSignup(onClose) {


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

        //fetch date from server and pass in the body to add current date in database.
        let url = `http://${globalVariable.value}/getCurrentDateTime`;
        let response = await fetch(url, {
            method: 'get',
        });
        let date = response.json;


        url = `http://${globalVariable.value}/registerUser`;
        response = await fetch(url, {
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
                "contactnoVerified": false,
                "dateTimeOfRegistration": date
            }),
        });

        if (response.status === 200) {
            alert('Registration is successful');
            // onClose(); // Close the modal on success
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
    <form className='signup-form' onSubmit={handleClick}>
    <div className='name-inputs-signup'>
        <input
            type="text"
            name='firstName'
            className='name-signup'
            value={formData.firstName}
            placeholder='Enter Your First Name'
            onChange={handleChange}
        />
        <input
            type="text"
            name='lastName'
            className='name-signup'
            value={formData.lastName}
            placeholder='Enter Your Last Name'
            onChange={handleChange}
        />
    </div>
    <input
        type="email"
        name='email'
        className='founder-signup-field'
        value={formData.email}
        placeholder='Enter Your Email'
        onChange={handleChange}
    />
    <input
        placeholder='Enter Your Password'
        name='password'
        className='founder-signup-field'
        value={formData.password}
        type='password'
        onChange={handleChange}
    />
    <input
        placeholder='Confirm Your Password'
        name='confirmPassword'
        className='founder-signup-field'
        value={formData.confirmPassword}
        type='password'
        onChange={handleChange}
    />
    <button className='signup-founder-button' type='submit'>Sign Up</button>
    <button className='link-account' onClick={onClose}>Already have an account?</button>
</form>
  )
}

export default FounderSignup