import React, { useEffect, useState, useRef } from "react";
import * as d3 from 'd3';

import { useNavigate} from 'react-router-dom';
function UploadFiles() {
    const navigate = useNavigate();
    const [generalFile, setGeneralFile] = useState(null);
    const [generalSuc, setGeneralSuc] = useState(null);
    const [generalSucInfo, setGeneralInfoSuc] = useState(null);
    const [extensiveSucInfo, setExtensiveSucInfo] = useState(null);
    const [extensiveFile, setExtensiveFile] = useState(null);
    const [reminder, setReminder] = useState(null);
    const handleFile1Change = (event) => {
        setGeneralFile(event.target.files[0]);
        console.log(event.target.files[0]);
      };
    const handleFile2Change = (event) => {
        setExtensiveFile(event.target.files[0]);
        console.log(event.target.files[0]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (generalFile) {
          try {
            const formData1 = new FormData();
            formData1.append('file', generalFile);
            for (let [key, value] of formData1.entries()) {
                console.log(key, value);
              }
            // console.log(formData1.entries);
            const response = await fetch('http://localhost:8011/api/user/upload-spotify-data', {
              method: 'POST',
              body: formData1,
              credentials: 'include' 
            });
            const result = await response.json();
            setGeneralSuc(true)
            setGeneralInfoSuc ("Successfully uploaded your general data zip ")
            console.log(result);
          } catch (error) {
            setGeneralInfoSuc ("Error when uploaded your general data zip: ", error)
            console.error('Error:', error.message);
          }
        }
        if (extensiveFile) {
            try {
              const formData2 = new FormData();
              formData2.append('file', extensiveFile);
              const response = await fetch('http://localhost:8011/api/history/upload-extended-streaming-history', {
                method: 'POST',
                body: formData2,
                credentials: 'include' 
              });
      
              const result2 = await response.json();
              setExtensiveSucInfo ("Successfully uploaded your extensive streaming data zip ")
              console.log(result2);
            } catch (error) {
                setExtensiveSucInfo ("Error when uploaded your extensive streaming data zip: ", error)
                console.error('Error:', error.message);
            }
          }

    }
    const handleClick = ()=>{
        if (generalSuc){
            navigate('/generalInfo')
        }else{
          setReminder("You haven't uploaded")
        }
    }

    return  <div className="uploadPage">
        <fieldset className="doodle-box" id="upload-box">
            <legend>Please Upload Your Data Zip</legend>
            <p>This website is to make you understand your data in spotify better. </p>
            <p>If you would like to see the visualization report, you can go <a href="https://www.spotify.com/us/account/privacy/" > here </a> to get more information and request your data.</p>
            <div className="uploadForm">
            <form  onSubmit={handleSubmit}>
            <label htmlFor="generalFile">General Data Zip:</label>
            <input type="file" id="generalFile" name="generalFile"  onChange={handleFile1Change}  />
            <label htmlFor="extensiveFile">Extensive Streaming Zip:</label>
            <input type="file" id="extensiveFile" name="extensiveFile" onChange={handleFile2Change}/>
            <button type="submit">Upload</button>
            </form>
            </div>
            <button onClick={handleClick}> I am done sending, ready to see my report!</button>
        </fieldset>
        {reminder?(<p>{reminder}</p>):(<div/>)}
        <p >{generalSucInfo}</p>
        <p >{extensiveSucInfo}</p>
   </div>
}
export default UploadFiles