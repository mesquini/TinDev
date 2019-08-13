import React, {useState} from 'react'
import logo from '../assets/logo.svg'

import api from '../services/api'

import '../css/Login.css'

export default function Login({history}){
    const [username, setUsername] = useState('')

    async function handleSubmit(e){
        e.preventDefault()
        const {data} = await api.post('/dashboard/',{
        username,
    })
        const id = data._id
        history.push(`/dashboard/${id}`)
    }

    return(
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt= "tindev"></img>
                <input id="username"
                value={username}
                required = 'true'
                onChange={e => setUsername(e.target.value)}
                placeholder="Digite seu usuario no GitHub"
                />
                <button type='submit'>Logar</button>
            </form>
        </div>
    );
}

