import React, {useState} from 'react'
import logo from '../assets/logo.svg'
import load from '../assets/load.svg'

import api from '../services/api'
import '../css/Login.css'

export default function Login({history}){
    const [username, setUsername] = useState('')
    let erroEl = document.getElementById('erro')
    var loadingEl = document.getElementById('loading')
    let formEl = document.getElementById('repo-form')  

    async function handleSubmit(e){
        e.preventDefault()     
        await setTratativas(true, false)
        const {data} = await api.post('/dashboard/',{username})
        if(data.status != null){
            await setTratativas(false,true)
        }else{
            history.push(`/dashboard/${data._id}`)
        }
    }

    async function setTratativas(loading = false, erro = false){      
        
        if(erro === true)
            erroEl.style.display = 'block';
        else 
            erroEl.style.display = 'none';

        if(loading === true)          
            loadingEl.style.display = 'block';   
        else 
            loadingEl.style.display = 'none';      
    }

    return(
        <div className="login-container">
            <form onSubmit={handleSubmit} id='repo-form'>
                {}
                <img src={logo} alt= "tindev"></img>
                <input id="username"
                value={username}
                required = {true}
                onChange={e => setUsername(e.target.value)}
                placeholder="Digite seu usuario no GitHub"
                />
                <button type='submit'>Logar</button>                  
                <strong className="erro" id="erro">Usuario não existente!</strong>
                <strong className="loading" id="loading">Carregando...<img src={load}></img></strong>
            </form>
        </div>        
    );    
}

