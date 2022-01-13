import React, {useContext, useState} from "react";
import { UserContext } from './UserContext';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Washer from './Washer';
import Washers from './Washers';
import Grid from '@mui/material/Grid';
import {w3cwebsocket as W3CWebSocket} from "websocket"

function Home(){

    // set user (not needed if I'm passing the access token in the URL every time)
    const {setUser} = useContext(UserContext);

    // pull the access token from the URL 
    const {id_token} = useParams();
    console.log(id_token);
    setUser(id_token)

    // pull name and email from backend 
    const baseURL = `${'http://127.0.0.1:8000'}/student_data`;

    // pull the dorm of the current student 
    const dorm = {dorm: 'Kissam' } // currently hardcoded, change when we figure out how to save the student info and ID globally 
    
    // pull dryer data for current dorm 
    const dryerURL = `${'http://127.0.0.1:8000'}/get_dorm_dryers`;
    
    // request the student data, the washer data, and the dryer data
    React.useEffect(() => {
        axios.get(baseURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            console.log('user data', user_data)
        });

        axios.post(dryerURL, dorm, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const dryer_data = response.data;
            console.log('dryer_data', dryer_data)
        });
      }, []);

  // websocket connection
  const socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/dryer/')
  
  socket.onopen = (event) => {
      console.log('socket opened!')
      
      // send data to socket backend; socket backend will automatically send something back 
      socket.send(JSON.stringify({
          'dorm': 'kissam',
          'user': 'jason',
          'washer': '1',
          'action': 'add to waitlist'
      }));
  
  }

  // update data here 
  socket.onmessage = (event) => {
    console.log('onmessage called', JSON.parse(event.data))
  }
    return(
        <div>
            {dorm['dorm']}
            <Washers id_token = {id_token} dorm = {dorm}/>
        </div>
    )
}

export default Home