import React, { useContext } from "react";
import { UserContext } from './UserContext';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Box, ThemeProvider } from '@mui/system';

// mapped onto a row of washers in home.js 
function Washer(props) {
    const state = useLocation(); 
    console.log(state)

    // the user currently using the washer, if any 
    if (!props){
        console.log('is !props working')
        return null
    } 

    // users currently reserving the washer, if any 
    let in_use = props['student_using']
    let currently_reserved = props['students_reserved']
    let bg_color = 'primary.white'
    if (in_use){
        bg_color = 'primary.in_use '

    } else if (currently_reserved) {
        bg_color = 'primary.reserved'

    } else{
        bg_color = 'primary.open'

    }

    // the state of the washer (in-use, reserved, empty)

    // the time remaining on the washer (selection by user)

    // notification sent boolean (false--> timer ends --> post call to send_notification --> flips to true)

    // 
    return (
        <div onClick = {props.onClick}>
            <ThemeProvider
                theme={{
                    palette: {
                        primary: {
                            white: "#FFFFFF",
                            open: '#4DAB9A',
                            reserved: "#FFDC49",
                            in_use: '#FF7369',
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.white',
                        '&:hover': {
                            backgroundColor: 'primary.white',
                            opacity: [0.9, 0.8, 0.7],
                        },
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: '50%',
                            width: 25,
                            height: 25,
                            bgcolor: bg_color,
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                    />
                </Box>
            </ThemeProvider>
        </div>
    );
}

export default Washer