import React, {useEffect, useState} from 'react';
import logo from '../Images/logo-no-background.png';
import { useNavigate } from 'react-router-dom';
import homepagepic from "../Images/businessperson-meeting-clip-art-transprent-png-team-work-11562903613sqceweh3yc.png";
import { globalVariable } from './globalVariables';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

function InvestorSignuptwo({ onBack, formData, setFormData }     ) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    // const [formData, setFormData] = useState({
    //     totalInvestedAmount: '',
    //     topInvestedComapines: ''
    // });

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     alert("Investor Signup Complete!");
    //   };

    // async function handleSubmit(e){
    //     e.preventDefault()
    //     let url = `http//${globalVariable.value}/registerInvestor`;
    //    let response=await fetch(url,{
    //     method:'POST',
    //         headers:{
    //             'content-type':'application/json'
    //         },
    //         body:JSON.stringify(
    //             {
    //                 "user" : {
    //                     "userId": 0,
    //                     "userName":sessionStorage.getItem("FirstName"),
    //                     "firstName": sessionStorage.getItem("FirstName"),
    //                     "lastName": sessionStorage.getItem("LastName"),
    //                     "email": sessionStorage.getItem("Email"),
    //                     "ContactNo" : sessionStorage.getItem("Phone"),
    //                     "category": sessionStorage.getItem("UserType"),
    //                     "password":false,
    //                     "visible": false,
    //                     "emailVerified" : false,
    //                     "contactnoVerified":false
    //                 },
    //                 "investor" : {
    //                     "investorId" : 0,
    //                     "totalInvestedAmount" : formData.totalInvestedAmount,
    //                     "topInvestedComapines" : formData.topInvestedComapines,
    //                     "userId" : 0
    //                 }
    //             }
    //         ),
    //     })  
    //     const data= await response.json()
    //     if(response.status == 200){
    //         toast('Thank you for registring. We will connect you soon.')
    //         setTimeout(() => {
    //             navigate("/");
    //         }, 5000);
    //     }
    //     else{
    //         toast("Already registered")
    //     }
    //   }
      
      
    
  return (
    <div className='home'>
    <div className='row '>
   {/* <div id=" header " className='col-md-1 d-flex'>
       <div id="logo-homepage">
           <img src={logo} alt=""/>
       </div>
       </div>
   
       <div class="text col-md-1">Home</div>
       <div class="text col-md-1">About</div>
       <div class="text col-md-1">Founder</div>
       <div class="text col-md-1">Investor</div>
       <div class="text col-md-3">Review</div>
       {/* <button className='home-signup col-md-1' onClick={onLogin}>Investor</button>
       
       <button className='home-Register col-md-1 ' onClick={onRegister}>Founder</button> */}
       {/* {username ? (
     <>
       <span className='text col-md-2'></span>
       <button className='home-Register col-md-1' >Logout</button>
     </>
   ) : (
     <>
       <button className='home-signup col-md-1' >Login</button>
       <button className='home-Register col-md-1' >Sign Up</button>
     </>
   )}  */}
       
       

   
      
   </div>

   <div className='input-container-Investor'> 
            <div className='cont-input-Investor'>
           <input type='text' placeholder='Companies you have invested' name = "topInvestedComapines" value={formData.topInvestedComapines} onChange={handleChange} className='founder-signup-field'/>
           <input type='text' placeholder='Total amount to invest' name = "totalInvestedAmount" value={formData.totalInvestedAmount} onChange={handleChange} className='founder-signup-field'/>
           <div>
           <button onClick={onBack}>Back</button>
           {/* <button onClick={handleSubmit}>Submit</button> */}
            <ToastContainer />
           </div>
           </div>

   </div>
   
   </div>
  )
}

export default InvestorSignuptwo