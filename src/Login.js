import React,{ useState  } from "react";
import swingImg from "./img/swing.png"
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [loginInfo, setloginInfo] = useState('');
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    for (let [key, value] of formData.entries()) {
      console.log(key, value); // Log the form data to the console
    }

   
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    fetch('http://localhost:8011/api/user/login', {
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
        return response.json()
        
        })
        .then(data =>{
          if (data.code != 0) {
              setError(data.message)
          }else{
              setloginInfo("Successfully logged in")
              setTimeout(() => {
                navigate('/upload');
              }, 1000)
          }
              
         })
       
        .catch(error => {
        setloginInfo("Error occoured when logging in:,",error)
        console.error('Error:', error);
        });

  };

    return( 
        <div className="loginPage">
            <fieldset className="doodle-box" id="login-box">
                <div id="loginTitle">
                <img id="swing" alt="swinging girl" src={swingImg} />
                <legend>Log In To Discover</legend>
                </div>
                <div className="loginContent">
                    <form onSubmit={handleSubmit} className="formContent">
                    <label htmlFor="uname">Username:</label>
                    <input type="text" id="username" name="username" className="form-control custom-input-size" />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" className="form-control custom-input-size" placeholder="Password"/>
                    <button type="submit" className="btn btn-outline-success btn-lg">Submit</button>
                    </form>
                <div className="switchBox">Don't have an account?<br /><a href="/register">Click to register :D</a></div>
                </div>
                
            </fieldset>
            <p>{loginInfo}</p>
            {error?(<p >{error}</p>):(null)}
        </div>

        
      
  )
    
}
export default Login;