import React, {useContext, useState} from "react"
import {w3cwebsocket as W3CWebSocket} from "websocket"

const DataContext = React.createContext()
const DataUpdateContext = React.createContext()

export function useData() {
    return useData(DataContext)
}

export function useDataUpdate() {
    return useData(DataUpdateContext)
}

export function DataProvider({children}) {
    const socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/dryer/')
    socket.onopen = (event) => {
        console.log('socket opened!')
    }
    socket.send(JSON.stringify({
        'dorm': 'kissam',
        'user': 'jason',
        'action': 'pull_data'
    }));

    socket.onmessage = (event) => {
        console.log('onmessage called', JSON.parse(event.data))
      }

    let initial_data = {} // set initial data by requesting data from websocket  

    const [data, setData] = useState({})    

    function updateData(){
        let new_data = '{}' // call websocket 
        setData(new_data)
    }

    return (
        <DataContext.Provider value = {data}>
            <DataUpdateContext.Provider value = {updateData}>
                {children}
            </DataUpdateContext.Provider>
        </DataContext.Provider>
    )
}