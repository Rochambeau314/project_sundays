import React, { useContext } from "react";
import { UserContext } from './UserContext';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, ThemeProvider } from '@mui/system';

// mapped onto a row of washers in home.js 
function Washer(props) {

    // the user currently using the washer, if any 

    // users currently reserving the washer, if any 

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
                            main: '#4DAB9A',
                            white: '#FFFFFF',
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
                            bgcolor: 'primary.main',
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