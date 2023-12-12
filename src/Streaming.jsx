import React, { useEffect, useState, useRef } from "react";
import DoodleBox from './DoodleBox';
import DonutChart from "./donutChart";
import BarChart from "./barChart";
import { useNavigate} from 'react-router-dom';
import { count } from "d3";
function Streaming(){
    let navigate = useNavigate();
    const [day, setDay] = useState([]);
    const [week, setWeek] = useState([]);
    const [timeData,setTimeData ] = useState([])
    const [sumHours,setSumHours ] = useState(null)
    const [sumMinutes,setSumMinutes ] = useState(null)
    const [countSongs,setCountSongs ] = useState(null)
    
    const handleButtonClick = () => {
        navigate('/playlist');
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    // var day =   {
    //     Morning: 385774,
    //     Afternoon: 627424,
    //     Evening: 522186,
    //     Night: 468832,
    // }
    // var sumHours = Math.round(Object.values(day).reduce((accumulator, currentValue) => accumulator/3600 + currentValue/3600, 0));
    // var sumMinutes = Math.round(Object.values(day).reduce((accumulator, currentValue) => accumulator/60 + currentValue/60, 0));
    // var countSongs = 10202;
    // var weekRaw= [
    //     {
    //       "day": 0,
    //       "secPlayed": 375065
    //     },
    //     {
    //       "day": 1,
    //       "secPlayed": 286568
    //     },
    //     {
    //       "day": 2,
    //       "secPlayed": 275071
    //     },
    //     {
    //       "day": 3,
    //       "secPlayed": 315635
    //     },
    //     {
    //       "day": 4,
    //       "secPlayed": 213158
    //     },
    //     {
    //       "day": 5,
    //       "secPlayed": 287459
    //     },
    //     {
    //       "day": 6,
    //       "secPlayed": 251260
    //     }
    // ]
    // var dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
   
   
    // var week = weekRaw.reduce((acc, dayData) => {
    //     let dayName = dayNames[dayData.day]; // Get the day name; modulo 7 ensures it loops over the array
    //     acc[dayName] = dayData.secPlayed;
    //     return acc;
    // }, {});
    
    // var timeRaw = {
    //     "0": 68024,
    //     "1": 85560,
    //     "2": 101457,
    //     "3": 95439,
    //     "4": 84503,
    //     "5": 33849,
    //     "6": 38711,
    //     "7": 53901,
    //     "8": 55946,
    //     "9": 53542,
    //     "10": 85483,
    //     "11": 98191,
    //     "12": 96808,
    //     "13": 120762,
    //     "14": 144974,
    //     "15": 113996,
    //     "16": 80070,
    //     "17": 70814,
    //     "18": 43202,
    //     "19": 59128,
    //     "20": 80802,
    //     "21": 116228,
    //     "22": 133625,
    //     "23": 89201
    //   }
    // var hourLabels = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
    // var timeData = Object.keys(timeRaw).map((key, index) => {
    // return {
    //     time: hourLabels[index],
    //     value: timeRaw[key]
    // };
    // });

    useEffect(() => {
      // Example fetch call to get your data
      const fetchData = async () => {
          // const clusterResponse = await fetch('path/to/cluster/data');
          // const clusterData = await clusterResponse.json();
          // setClusterData(clusterData);
        try{
          const weekResponse = await fetch('http://localhost:8011/api/history/get-sec-played-by-day', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
          if (!weekResponse.ok) {
              throw new Error(`HTTP error! Status: ${weekResponse.status}`);
          }
          const weekRaw = await weekResponse.json();
          if (Array.isArray(weekRaw.data)) {
            var dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            var week = weekRaw.data.reduce((acc, dayData) => {
                let dayName = dayNames[dayData.day-1]; // Get the day name; modulo 7 ensures it loops over the array
                acc[dayName] = dayData.secPlayed;
                return acc;
            }, {});
            console.log(week);
            setWeek(week);
          }else {
            console.error('Received data is not in expected format:', weekRaw);
          }

          const dayResponse = await fetch('http://localhost:8011/api/history/get-sec-played-by-periods', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
          if (!dayResponse.ok) {
              throw new Error(`HTTP error! Status: ${dayResponse.status}`);
          }
          const dayRaw = await dayResponse.json();
          
          setDay(dayRaw.data)
          var sumHours = Math.round(Object.values(dayRaw.data).reduce((accumulator, currentValue) => accumulator/3600 + currentValue/3600, 0));
          var sumMinutes = Math.round(Object.values(dayRaw.data).reduce((accumulator, currentValue) => accumulator/60 + currentValue/60, 0));
          setSumHours(sumHours)
          setSumMinutes(sumMinutes)
          const timeResponse = await fetch('http://localhost:8011/api/history/get-sec-played-by-hours', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
          if (!timeResponse.ok) {
              throw new Error(`HTTP error! Status: ${timeResponse.status}`);
          }
          const timeRaw = await timeResponse.json();
          var hourLabels = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
          var timeData = Object.keys(timeRaw.data).map((key, index) => {
          return {
              time: hourLabels[index],
              value: timeRaw.data[key]
          };
          });
          
          setTimeData(timeData)
          

          const totalResponse = await fetch('http://localhost:8011/api/history/get-total-listened-songs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
          if (!totalResponse.ok) {
              throw new Error(`HTTP error! Status: ${totalResponse.status}`);
          }
          const countSongs = await totalResponse.json();
        
          setCountSongs(countSongs.data)

          
      }catch (error) {
        console.error('Fetch error:', error);
      }
          
      };
    
      fetchData();
    
      // Initialize your charts here - this code will run after the state is set
    }, []);
    


    useEffect(() => {
        if (day && week) {
          DonutChart("#donutChart",day,week) 
        }
        if (timeData) {
          BarChart("#barChart",timeData)  
        }
         
    },[day,week,timeData]);

    return  <DoodleBox title="Your streaming history Visualization"id="streamingViz">
            <p>It's time to explore your listening habit!</p>
            {sumHours && sumMinutes && countSongs?( <p>So far, you played <span className="hightlightNum">{sumHours}</span> hours or <span className="hightlightNum">{sumMinutes}</span> minutes of music in total and listerned <span className="hightlightNum">{countSongs} </span>songs/times in total! </p>
           ):(null)}
            <p>First, any preferred time for listening to music during the day? Or prefered day during the week ?</p>
            <p>Ratio is calculated from seconds of played music during that time period</p>
            <div id="donutChart"></div>
            <p>Want to know more about your favorate time of a day to listen music? </p>
            <div id="barChart"></div>
            <button type="button"onClick={handleButtonClick}>
            Go to view Playlist & Artist Visualization 
            </button>
    </DoodleBox>
    }  
export default Streaming;

