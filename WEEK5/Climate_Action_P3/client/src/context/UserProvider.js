import React, { useState } from 'react'
import axios from 'axios'

export const UserContext = React.createContext()

//Axios interceptor
const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authrization = `Bearer ${token}`
    return config
})

export default function UserProvider(props) {
    // const initState = { user: {}, token: "" }
    // const [userState, setUserState] = useState(initState)
    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        todos: [] //Tracks todos by user
    }

    const [userState, setUserState] = useState(initState)

    function signup(credentials) {
        axios.post('/authrouter/signup', credentials)
            .then(res => {
                const { user, token } = res.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                setUserState(prevUserState => ({
                    ...prevUserState,
                    user,
                    token
                }))
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    function login(credentials) {
        axios.post('/authrouter/login', credentials)
        .then(res => {
            const { user, token } = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            getUserTodos()
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }))
        })
        .catch(err => console.log(err.response.data.errMsg))   
    }

    //Logout
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user: {},
            token: "",
            todos: []
        })
    }
    
    function getUserTodos(){
        userAxios.get("/api/todo/user")
          .then(res => {
            setUserState(prevState => ({
              ...prevState,
              todos: res.data
            }))
          })
          .catch(err => console.log(err.response.data.errMsg))
      }
    
      function addTodo(newTodo){
        userAxios.post("/api/todo", newTodo)
          .then(res => {
            setUserState(prevState => ({
              ...prevState,
              todos: [...prevState.todos, res.data]
            }))
          })
          .catch(err => console.log(err.response.data.errMsg))
      }
    
      return (
        <UserContext.Provider
          value={{
            ...userState,
            signup,
            login,
            logout,
            addTodo
          }}>
          { props.children }
        </UserContext.Provider>
      )
    }