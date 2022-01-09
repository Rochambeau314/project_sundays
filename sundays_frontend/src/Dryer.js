import React, {useContext} from "react";
import { UserContext } from './UserContext';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Dryer(){
    return(
        <div>
            Dryer
        </div>
    )
}

export default Dryer