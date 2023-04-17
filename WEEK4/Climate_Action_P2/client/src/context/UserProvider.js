import React, { useState } from 'react'
import axios from 'axios'
export const UserContext = React.createContext()

export default function UserProvider(props) {
    const initState = { user: {}, token: "" }
    const [userState, setUserState] = useState(initState)

    function signup(credentials) {
        axios.post('/authrouter/signup', credentials)
            .then(res => console.log(res))            
            .catch(err => console.dir(err.response.data.essMsg))    
    }

    function login(credentials) {
        axios.post('/authrouter/login', credentials)
            .then(res => console.log(res))            
            .catch(err => console.dir(err.response.data.essMsg))    
    }
    
    return (
        <UserContext.Provider value={ { ...userState, signup, login} }>
            { props.children }
        </UserContext.Provider>
    )
}

