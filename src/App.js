import './App.css';
import 'doodle.css/doodle.css'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Login from './Login';

import Register from './Register';
import Playlist from './Playlist';
import Streaming from './Streaming';
import UploadFiles from './upload';
import GeneralInfo from './generalInfo';

function App() {
  return (
   
    <Router>
      <Routes>
        <Route path="/" element = {<Login/>} />
        <Route path="/register" element = {<Register/>} />
        <Route path="/playlist" element = {<Playlist/>} />
        <Route path="/streaming" element = {<Streaming/>} />
        <Route path="/upload" element = {<UploadFiles/>} />
        <Route path="/generalInfo" element = {<GeneralInfo/>} />
      </Routes>
  </Router>
  );
}

export default App;
