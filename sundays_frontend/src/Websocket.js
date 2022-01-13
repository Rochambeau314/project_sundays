import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React, {useState, useMemo, useRef} from 'react';
import {UserContext} from './UserContext.js';

import {w3cwebsocket as W3CWebSocket} from "websocket"

class Websocket{
    client = new W3CWebSocket('ws://127.0.0.1:8000/ws/counter/');
    componenetDidMount(){
        console.log('websocket component mounted!')
        this.client.onopen = () => {
            console.log('websocket client connected! ')
        }
    }
}

export default Websocket 