import React, {useState, useEffect} from 'react';
import './App.css';
import {Contacts} from './components/Contacts'
import {Box} from "@mui/material"
import {Filters} from "./components/Filters";
import {FilterProvider} from './contexts/FilterContext';

const App: React.FC = () => {
  const data = {
    "refreshToken": "059c420e-7424-431f-b23b-af0ecabfe7b8",
    "teamId": "a001994b-918b-4939-8518-3377732e4e88"
  }
  const apiUrlGetToken: string = 'https://api-teams.chatdaddy.tech/token'
  const [totalContacts, setTotalContacts] = useState<number>(0);

  useEffect(() => {
      fetch(apiUrlGetToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(data => {
          localStorage.setItem('token', data.access_token);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  )

  return (
    <FilterProvider>
      <div className="App">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            m: 0
          }}
        >
          <Box sx={{
            width: 250,
            p: 2,
            boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)'
          }}>
            <Filters totalContacts={totalContacts} />
          </Box>
          <Box sx={{flexGrow: 1}}>
            <Contacts setTotalContacts={setTotalContacts} />
          </Box>
        </Box>
      </div>
    </FilterProvider>
  )
}

export default App;
