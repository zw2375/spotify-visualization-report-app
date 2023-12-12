import React, { useEffect, useState, useRef } from "react";
import * as d3 from 'd3';
import RadarChart from './radarChart'; 
import DoodleBox from './DoodleBox';
import ClusterChart from "./clusterChart";
import { useNavigate} from 'react-router-dom';
function Playlist() {
  let navigate = useNavigate();
  const [playlistList, setplaylistList] = useState(null);
  const [seletedPltData, setSeletedPltData] = useState(null);
  const [seletedGenPlt, setSeletedGenPlt] = useState([]);
  const [streamFlg,setStreamFlg ] = useState(null)
  const [typedArtist,setTypedArtist ] = useState([])
  const [error, setError] = useState(null);
  const handleButtonClick = () => {
    navigate('/streaming');
    window.scrollTo(0, 0); 
  };
  fetch('http://localhost:8011/api/history/get-sec-played-by-day', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include'
    })
    .then(response => {
      // console.log(response);
        return response.json()
        
    })
    .then(data =>{
      if (data.code != 0) {
          setError(data.message)
      }else{
        setStreamFlg(true)
      }
          
    })
  
  var margin = {top: 100, right: 200, bottom: 200, left: 200}
  var width = 650
  var height = 650
  var color = d3.scaleOrdinal().range(d3.schemeTableau10);
  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    minValue: 0,
    levels: 10,
    roundStrokes: true,
    color: color
  };


useEffect(() => {
  // Example fetch call to get your data
  const fetchData = async () => {
    
      try{
      const pltResponse = await fetch('http://localhost:8011/api/playlist/get-avg-features', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
      if (!pltResponse.ok) {
          throw new Error(`HTTP error! Status: ${pltResponse.status}`);
      }
      const pltData = await pltResponse.json();
      if (pltData.code!=0) {
        setError(pltData.message)
      }else{
        if (pltData && Array.isArray(pltData.data)) {
          var playlistList = pltData.data.map(item => item.playlistName);
          setplaylistList(playlistList);
          var genPltData = pltData.data.map(playlist => [
          { axis: "Danceability", value: playlist.danceability },
          { axis: "Energy", value: playlist.energy },
          { axis: "Loudness", value: (playlist.loudness+60)/60 },
          { axis: "Liveness", value: playlist.liveness },
          { axis: "Valence", value: playlist.valence },
          // Add more attributes as needed
        ]);
          setSeletedPltData(genPltData);
          setSeletedGenPlt(playlistList);
        }
      }
      
      const artistResponse = await fetch('http://localhost:8011/api/playlist/get-avg-features-per-artist', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
      if (!artistResponse.ok) {
          throw new Error(`HTTP error! Status: ${pltResponse.status}`);
      }

    const artistData = await artistResponse.json();
    if (artistData.code!=0) {
        setError(artistData.message)
      }else{
    const typedArtist = artistData.data.map((curArtist) =>{
      var emotions = ["pleased","happy","calm","excited","angry","nervous","bored", "sad","sleepy","peaceful","relaxed"]
      var curEmo = determineEmo(curArtist["energy"], curArtist["valence"])
      return {
        "name": curArtist["artistName"],
        "typenum": emotions.indexOf(curEmo),
        "type": curEmo,
        "total":curArtist["total"]
      }
    })
    console.log(typedArtist);
    setTypedArtist(typedArtist)
    }
    function determineEmo(energy,valence) {
      var x = valence - 0.5
      var y = energy - 0.5 
      let angleRadians = Math.atan2(y, x);
      if (angleRadians>=0&&angleRadians<= 30 ) {
        return "pleased"
      }else if (angleRadians>30&&angleRadians<= 60 ) {
        return "happy"
      }else if (angleRadians>60&&angleRadians<= 90 ) {
        return "calm"
      }else if (angleRadians>90&&angleRadians<=120 ) {
        return "excited"
      }else if (angleRadians>120&&angleRadians<=150 ) {
        return "angry"
      }else if (angleRadians>150&&angleRadians<=180 ) {
        return "nervous"
      }else if (angleRadians>-180&&angleRadians<=-150 ) {
        return "bored"
      }else if (angleRadians>-150&&angleRadians<=-90 ) {
        return "sad"
      }else if (angleRadians>-90&&angleRadians<=-60 ) {
        return "sleepy"
      }else if (angleRadians>-60&&angleRadians<=-30 ) {
        return "peaceful"
      }else if (angleRadians>-30&&angleRadians<0 ) {
        return "relaxed"
      }
      
    }
  }catch (error) {
    console.error('Fetch error:', error);
  }
      
  };

  fetchData();

  
}, []);


  
  //handle data filter for radar chart
  const handleSubmit = (event) => {
    const form = event.target;
    event.preventDefault();
    const formData = new FormData(form);
    const checkedValues = formData.getAll('checkboxes');
    var filteredGenPlt=[]
    for (let i = 0; i < checkedValues.length; i++) {
      if (playlistList.includes(checkedValues[i])){
        var curIdx = playlistList.indexOf(checkedValues[i])
        filteredGenPlt.push(seletedPltData[curIdx])
      }
    }

    setSeletedPltData(filteredGenPlt)
    setSeletedGenPlt(checkedValues)
};

  
  // Set up for Cluster Chart
  
  useEffect(() => {
  if (Array.isArray(seletedPltData)) {
  RadarChart("#radarChart",seletedPltData, radarChartOptions,seletedGenPlt);
  }
  if (typedArtist!=[]) {
    ClusterChart("#clusterChart",typedArtist,["pleased","happy","calm","excited","angry","nervous","bored", "sad","sleepy","peaceful","relaxed"])
  }
  
  
}, [seletedPltData,seletedGenPlt,typedArtist]);
    return (
      <DoodleBox title="Your Playlist & Artists Visualization"id="playlistViz">
      {playlistList&& typedArtist?(
        <div>
          <div id="clusterChart">
          <p>In the following visualization, each circle is a artist you have in all your playlist, their color indicate their songs' emotion type in music.</p>
          <p>The size of the circles is determined by the quantity of the songs you have in all your playlists</p>
          <p>Hover and drag to know more about it!</p>
        </div>
        <form  className="selectGenPlt" onSubmit={handleSubmit}>
        <p>Select the playlists you want to know about:</p>
        <div className="genPltOpt">
          {playlistList.map((item, index) => (
                  <div key={index}>
                    <input 
                      type="checkbox" 
                      id={`checkbox-${index}`} 
                      value={item} 
                      name='checkboxes'
                    />
                    <label htmlFor={`checkbox-${index}`}>{item}</label>
                  </div>
                ))}
        </div>
        <button type="submit" id="pltSub" className="btn btn-outline-success btn-sm">Submit</button>
        </form>
        <div id="radarChart"></div>
        {streamFlg?(<button onClick={handleButtonClick} type="button">
            Go to view Streaming Visualization 
          </button>
        ):(<div/>)}
        </div>
      ):(<p>Loading data...</p> )}
      {error?(<p >{error}</p>):(null)}
    
      </DoodleBox>
    
    );
  }

  export default Playlist;