import React, {useContext, useState} from "react";
import { UserContext } from './UserContext';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Washer from './Washer';
import Grid from '@mui/material/Grid';

function Washers(props){

    // data for each washer stored here 
    const [washer_data, setWasher] = useState([]);

    // pull washer data for current dorm 
    const washerURL = `${'http://127.0.0.1:8000'}/get_dorm_washers`;
    React.useEffect(() => {
        axios.post(washerURL, props.dorm, { headers: {"Authorization": `Token ${props.id_token}`} })
            .then((response) => {
            const washer_data = response.data;
            console.log('washer_data', washer_data)
            setWasher(washer_data)
        });
    }, []);

    // map the washer data to Washer Components 
    const new_mapped_washer_data = 
        <Grid container rowSpacing={0.5} columnSpacing={0.25}> 
            {washer_data.map((washer) =>
            <Grid item key = {washer.number} xs={0.25}>
                <Washer 
                    dorm = {washer.dorm} 
                    number = {washer.number} 
                    student_using = {washer.student_using} 
                    students_reserving = {washer.students_reserving}
                    onClick = {(event) => handleWasherClick(event, washer.number)}
                />
            </Grid>
            )}
        </Grid>

    // redirects to specific washer when a washer is clicked 
    let navigate = useNavigate();
    async function handleWasherClick(event, number){
        //console.log('washer clicked')
        let data = washer_data[number]
        console.log(data)
        navigate(`../WasherDetails/${number}/${props.id_token}`, {state : data} );
    }

    return(
        <div> 
            {new_mapped_washer_data}
        </div>
        )
}

export default Washers 