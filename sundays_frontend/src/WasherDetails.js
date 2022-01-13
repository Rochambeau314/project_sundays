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

function WasherDetails(props){ 

    // pull user, dorm, and the specific washer data from the URL 
    const {number, id_token} = useParams();
    const dorm = "kissam"
    console.log(number, id_token) //hardcoded now, add in var later

    const washer_socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/washer/')
  
    washer_socket.onopen = (event) => {
        console.log('washer_socket opened!')
    }

    // button to reserve/mark as in-use 
    //let action = 'mark as in-use'
    let action = 'add to waitlist'
    let navigate = useNavigate();
    async function handleSubmit(event) {
        console.log('button pressed!')
        // send data to socket backend; socket backend will automatically send something back 
        washer_socket.send(JSON.stringify({
            'dorm': dorm,
            'user': id_token,
            'number': number,
            'action': action,
        }));

        // redirect user to home 
        //navigate(`../home/${id_token}`, { replace: false });

    }
    
    // update data here 
    washer_socket.onmessage = (event) => {
        console.log('message received!', JSON.parse(event.data))
    }

    
    return(
        <div>
            <div>WasherDetails</div>
            <Washer/>
            <Button variant="contained"onClick={handleSubmit} size = "large"> Submit</Button>
        </div>
    )   
} 
export default WasherDetails 

