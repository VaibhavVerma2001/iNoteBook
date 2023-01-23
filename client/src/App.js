import React, { useState } from 'react';
import './App.css';
import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';


function App() {


  // or can create context 
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }


  return (
    <>
      {/* WRAP IN NoteState so that all state vars in notestate can be used by all components and components of components inside that */}
      <NoteState>
        <Router>
          {/* components in all pages */}
          < Navbar />
          <Alert alert={alert} />

          <Routes>
            {/* specific component */}
            <Route path="/" element={<Home showAlert = {showAlert} />} />
            <Route path="/about" element={ localStorage.getItem('token')? <About /> : <Navigate to="/login" /> } />
            <Route path="/login" element={<Login showAlert = {showAlert} />} />
            <Route path="/signup" element={<Signup showAlert = {showAlert} />} />

          </Routes>
        </Router>

      </NoteState>
    </>
  )
}

export default App;
