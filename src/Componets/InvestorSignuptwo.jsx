import React, {useEffect, useState} from 'react'
import logo from '../Images/logo-no-background.png'
import { useNavigate } from 'react-router-dom'
import homepagepic from "../Images/businessperson-meeting-clip-art-transprent-png-team-work-11562903613sqceweh3yc.png"
import { globalVariable } from './globalVariables';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InvestorSignuptwo() {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [formData, setFormData] = useState({
        totalInvestedAmount: '',
        topInvestedComapines: ''
    });

    async function handleClick(event){
        console.log(sessionStorage.getItem("UserType"))
        event.preventDefault()
        let url = `http://${globalVariable.value}/registerInvestor`;
       let response=await fetch(url,{
        method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(
                {
                    "user" : {
                        "userId": 0,
                        "userName":sessionStorage.getItem("FirstName"),
                        "firstName": sessionStorage.getItem("FirstName"),
                        "lastName": sessionStorage.getItem("LastName"),
                        "email": sessionStorage.getItem("Email"),
                        "ContactNo" : sessionStorage.getItem("Phone"),
                        "category": sessionStorage.getItem("UserType"),
                        "password":"123456",
                        "visible": false,
                        "emailVerified" : false,
                        "contactnoVerified":false
                    },
                    "investor" : {
                        "investorId" : 0,
                        "totalInvestedAmount" : formData.totalInvestedAmount,
                        "topInvestedComapines" : formData.topInvestedComapines,
                        "userId" : 0
                    }
                }
            ),
        })  
        const data= await response.json()
        console.log(response.status)
        if(response.status == 200){
            toast('Thank you for registring. We will connect you soon.')
            setTimeout(() => {
                navigate("/");
            }, 5000);
        }
        else{
            toast("Already registered")
        }
        console.log(data)
      }
      
      
    
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

   <div className='input-container'> 
            <div className='cont-input'>
           <input type='text' placeholder='Companies you have invested' name = "topInvestedComapines" value={formData.topInvestedComapines} onChange={handleChange} className='input-1'/>
           <input type='text' placeholder='Total amount to invest' name = "totalInvestedAmount" value={formData.totalInvestedAmount} onChange={handleChange} className='input-2'/>
           <div>
           <button className='sign-up-invest' onClick={handleClick}>Sign Up</button>
            <ToastContainer />
           </div>
           </div>

   </div>
   
   </div>
  )
}

export default InvestorSignuptwo