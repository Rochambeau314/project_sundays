import './App.css';
import Login from './Login.js';
import Home from './Home.js';
import Washer from './Washer.js';
import Dryer from './Dryer.js';
import NewUser from './NewUser.js';
import Admin from './Admin.js';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React, {useState, useMemo} from 'react';
import {UserContext} from './UserContext.js';

function App() {
  const [user, setUser] = useState(null);  

  const value = useMemo(() => ({user, setUser}), [user, setUser]);

  return (      
    <div className="App">    
    <UserContext.Provider value = {value}>
      <Routes>
          <Route path = '' element ={<Login />} />
          <Route path = 'NewUser/:id_token' element ={<NewUser />} />
          <Route path = 'Home/:id_token' element = {<Home />} />
          <Route path = 'Washer/:number/:id_token' element = {<Washer />} />
          <Route path = 'Dryer/:id_token' element = {<Dryer />} />
          <Route path = 'Admin/:id_token' element ={<Admin />} />
      </Routes>
    </UserContext.Provider>
    </div>
  );
}

export default App;
