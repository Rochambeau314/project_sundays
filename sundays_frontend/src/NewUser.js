import React, {useContext} from "react";
import { UserContext } from './UserContext';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import logo from './project-sundays.png';

function NewUser(){

    // set user (not needed if I'm passing the access token in the URL every time)
    const {setUser} = useContext(UserContext);


    // pull the access token from the URL 
    const {id_token} = useParams();
    console.log(id_token);
    setUser(id_token)


    // pull name and email from backend 
    const [name, setName] = React.useState('');
    const baseURL = `${'http://127.0.0.1:8000'}/user_data`;
    React.useEffect(() => {
        axios.get(baseURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            console.log(user_data)
            setName(user_data['name'])
        });
      }, []);


    // dorm locations 
    const DORM_LOCATIONS = [
        {value: 'Kissam', label: 'Kissam'},
        {value: 'EBI', label: 'EBI'},
        {value: 'Zeppos', label: 'Zeppos'},
        {value: 'Rothschild', label: 'Rothschild'},
        {value: 'Commons', label: 'Commons'},
        {value: 'Village', label: 'Village'},
        {value: 'Rand', label: 'Rand'},
        {value: 'Branscomb', label: 'Branscomb'},
        {value: 'Highland', label: 'Highland'},
    ]
    const [dorm, setDorm] = React.useState('Kissam');
    const handleDormChange = (event) => {
        setDorm(event.target.value);
    }

    // grabs data from all forms, converts to JSON, sends to backend, redirects to home 
    let navigate = useNavigate();
    async function handleSubmit(event) {
        // grabs data from all forms and converts to JSON format 
        let student_data = {dorm: dorm}
        console.log(student_data)

        // send student_data to the backend 
        const create_student_baseURL = `${'http://127.0.0.1:8000'}/create_student`;
        axios.post(create_student_baseURL, student_data, { headers: {"Authorization": `Token  ${id_token}`}})
            .then((response) => {
                console.log(response)
                const response_data = response.data;
                console.log(response_data)

                // redirect to home
                navigate(`../home/${id_token}`, { replace: false });

        });
    }
    return(
        <div>
            <img src = {logo} alt = {"logo"} height = {200} width = {300}/>
            <h2>Hi {name}!</h2> 
            <h2>Welcome to Project Sundays!</h2>
            <h1> </h1>
            <TextField 
                id="outlined-select-dorm" 
                select
                label="Dorm" 
                variant="outlined" 
                required 
                error 
                value = {dorm} onChange={handleDormChange}
                size = "small"
                helperText = "Select your dorm"
            >
                {DORM_LOCATIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
            </TextField>

            <Button variant="contained"onClick={handleSubmit} size = "large"> Submit</Button>
        </div>
    )
}

export default NewUser