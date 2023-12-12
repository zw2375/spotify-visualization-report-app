import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
function GeneralInfo() {
    const [genData, setGenData] = useState(null);
    const [uniqueAddresses,setUniqueAddresses] = useState(null)
    const [inference,setInference] =  useState(null)
    const [payment,setPayment] = useState(null)
    
    let navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/playlist');
        window.scrollTo(0, 0); // Scroll to the top of the page
      };
    
    useEffect(() => {
        fetch('http://localhost:8011/api/user/get-userdata', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            
            const parsedAddressData=JSON.parse(data.data.spotifyAddresses)
            setGenData(data.data); // Update the state
            const curUnique = Array.isArray(parsedAddressData) ? parsedAddressData.filter((address, index, self) =>
            index === self.findIndex(t => 
                t.city === address.city && t.state === address.state && 
                t.street === address.street && t.postal_code_short === address.postal_code_short 
            )

        ) : [];
            const parsedInferenceData = JSON.parse(data.data.spotifyInferences);
            const filteredInferences = parsedInferenceData.inferences.filter(inference => inference.split(' ').length === 1 &&!inference.includes('_'));
            const inferenceText = filteredInferences.join(', ');
            setInference(inferenceText)
            setUniqueAddresses(curUnique);

            const parsedPayment = JSON.parse(data.data.spotifyPayments)
            let results = {};
            const cardType = parsedPayment.payment_method.split(' ')[0];
            results.type = cardType
            const lastFourDigits =  parsedPayment.payment_method.match(/\d{4}/g).pop(); // 'g' flag to find all matches, pop to get the last one
            results.lastFourDigits= lastFourDigits;
            const expiryDate =  parsedPayment.payment_method.match(/\d{2}\/\d{2}/)[0]; // Assumes format is always two digits, a slash, then two digits
            results.expDate = expiryDate
            setPayment(results)
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    }, []); // The empty array ensures this effect runs only once
    
    return (
        <div className="generalInfo">
            <fieldset className="doodle-box" id="upload-box">
                <legend>Welcome!</legend>
                <h1>We already know a lot about you now:</h1>
                {genData ? (
                    <>
                        
                {genData.spotifyBirthdate && genData.spotifyCountry &&<p>You are born in <span className="highlight">{genData.spotifyBirthdate}</span>, mainly listen to Spotify in <span className="highlight">{genData.spotifyCountry}</span>.</p>}
                {genData.spotifyCreateTime && genData.spotifyEmail &&  <p>Your Spotify journey started from  <span className="highlight">{genData.spotifyCreateTime}</span> using the email <span className="highlight">{genData.spotifyEmail}</span></p>}      
                {uniqueAddresses &&     <div>
                        <p>A list of places you lived in :</p>
                        <div id="address-box">
                        <ul> 
                            {uniqueAddresses.map((address, index) => (
                                <li key={index} className="indi-box">
                                    <p>Street: <span className="highlight">{address.street}</span></p>
                                    <p>City: <span className="highlight">{address.city}</span></p>
                                    <p>State: <span className="highlight">{address.state}</span></p>
                                    <p>Postal Code: <span className="highlight">{address.postal_code_short}</span></p>
                                </li>
                            ))}
                        </ul>
                        </div>
                        </div>}
                {inference && 
                <div>
                <p>Your hobbies relate to <span className="highlight">{inference}</span></p>
                </div>
                }
                {payment && 
                <div>
                <p>You have a <span className="highlight">{payment.type}</span> card ending in <span className="highlight">{payment.lastFourDigits}</span>, expired in <span className="highlight">{payment.expDate}</span></p>
                </div>

                
                }
                    </>
                ) : (
                    <p>Loading data...</p> // Display loading message or spinner
                )}
                <button onClick={handleButtonClick} type="button">
                Go to view Playlist & Artist Visualization 
                </button>
            </fieldset>
        </div>
    );
}

export default GeneralInfo;
