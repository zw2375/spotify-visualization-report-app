import React, {useState} from "react";
import swingImg from "./img/swing.png"
import musicNote1 from "./img/1.png"
import musicNote2 from "./img/2.png"
import {useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [registerInfo, setRegisterInfo] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Or build your request body manually if not using FormData
        const formData = new FormData(event.target);
        
    
        // If you need to convert FormData to a plain object:
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        
        });
       
        fetch('http://localhost:8011/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
            credentials: 'include' 
            })
            .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            setRegisterInfo('Successfully registered');
            setTimeout(() => {
                navigate('/');
            }, 1000)
            })
           
            .catch(error => {
            setRegisterInfo('Error occoured when registering: ',error)
            console.error('Error:', error);
            });
    
        
        
      };
    return( 
        <div className="registerPage">
            <fieldset className="doodle-box" id="register-box">
                <div id="registerTitle">
                <img id="swing2" alt="swinging girl" src={swingImg} />
                <legend>Register To Discover</legend>
                
                </div>
                <div className="registerContent">
                    <form  onSubmit={handleSubmit} className="formContent">
                    <label htmlFor="uname">Username:</label>
                    <input type="text" id="username" name="username" className="form-control custom-input-size" />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" className="form-control custom-input-size" placeholder="Password"/>
                    <label htmlFor="password">Enter your password again:</label>
                    <input type="password" id="checkPassword" name="checkPassword" className="form-control custom-input-size" placeholder="Password"/>
                    <button type="submit" className="btn btn-outline-success btn-lg">Submit</button>
                    </form>
                <div className="switchBox">Already have an account?<br></br> <a href="/login">Click to login :D</a></div>
                </div>
                
            </fieldset>
            <p >{registerInfo}</p>
        </div>
     
  )
    
}
export default Register;