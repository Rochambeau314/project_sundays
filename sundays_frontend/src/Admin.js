import React, {useContext} from "react";
import { UserContext } from './UserContext';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

function Admin(){

    // set user (not needed if I'm passing the access token in the URL every time)
    const {setUser} = useContext(UserContext);


    // pull the access token from the URL 
    const {id_token} = useParams();
    console.log(id_token);
    setUser(id_token)


    // pull name and email from backend 
    const baseURL = `${'http://127.0.0.1:8000'}/user_data`;
    React.useEffect(() => {
        axios.get(baseURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            console.log(user_data)
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
  };
    // set number of washers 
    const [washers, setWashers] = React.useState('0');
    const handleWasherChange = (event) => {
        setWashers(event.target.value);
    }

    const [dryers, setDryers] = React.useState('0');
    const handleDryerChange = (event) => {
        setDryers(event.target.value);
    }

    // grabs data from all forms, converts to JSON, sends to backend, redirects to home 
    let navigate = useNavigate();
    async function handleSubmit(event) {
        // grabs data from all forms and converts to JSON format 
        let student_data = {dorm: dorm, num_washers:washers, num_dryers:dryers}
        console.log(student_data)

        // send student_data to the backend 
        const create_wd_baseURL = `${'http://127.0.0.1:8000'}/create_wd`;

        axios.post(create_wd_baseURL, student_data, { headers: {"Authorization": `Token  ${id_token}`}})
            .then((response) => {
                console.log(response)
                const response_data = response.data;
                console.log(response_data)

                // redirect to home
                navigate(`../home/${id_token}`, { replace: true });

        });
    }
    return(
        <div>
            {id_token}
            <TextField 
                id="outlined-select-dorm" 
                select
                label="Dorm" 
                variant="outlined" 
                required 
                error 
                value = {dorm} onChange={handleDormChange}
                helperText = "Select your dorm"
            >
                {DORM_LOCATIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
            </TextField>
            <TextField id="outlined-basic" type = "number" label="Number of Washers" variant="outlined" value = {washers} onChange={handleWasherChange} />

            <TextField id="outlined-basic" type = "number" label="Number of Dryers" variant="outlined" value = {dryers} onChange={handleDryerChange}  />
            <Button 
                variant="contained"
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </div>
    )
}

export default Admin