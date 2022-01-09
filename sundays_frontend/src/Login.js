
import React, { useEffect, useCallback, useContext } from 'react';
import ReactDOM from 'react-dom';
import GoogleButton from 'react-google-button';
import { UserContext } from './UserContext';
import logo from './project-sundays.png';
function Login() {
  const {user, setUser} = useContext(UserContext);
  /*async () => {
    const session_id = await Google;
  }*/
  // backend returns the session id here, which is then set 
  // frontend senses when session id is returned, and then redirects when it occurs (logged in)
  // calls with session id to see if user has a profile or not 
  // profile exists = redirect to home, no profile = redirect to create profile, which then redirects to home 

  //Google Login function 
    const openGoogleLoginPage = useCallback(() => {
        const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const redirectUri = 'GoogleOAuth'; 
      
        const scope = [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ');
      
        const params = {
          response_type: 'code',
          client_id: '956682115584-1od101difchaua00q2oimmnp4kurc0vu.apps.googleusercontent.com',
          redirect_uri: `${'http://127.0.0.1:8000'}/${redirectUri}`,
          prompt: 'select_account',
          access_type: 'offline',
          scope 
        };
      
        const urlParams = new URLSearchParams(params).toString();
      
        window.location = `${googleAuthUrl}?${urlParams}`;
      }, []);

    return(
        <div className="login">
            <h1> Project Sundays</h1>
            <img src = {logo} alt = {"logo"} height = {200} width = {300}/>
            <GoogleButton style={{margin: "auto"}} onClick={openGoogleLoginPage}/>
        </div>
    )
}

export default Login
