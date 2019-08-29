import React, {useEffect, useState} from 'react'
import io from 'socket.io-client'
import '../css/Dashboard.css'
import '../css/Header.css'
import api from '../services/api'

import logo from '../assets/logo.svg'
import load from '../assets/load.svg'
import itsamatch from '../assets/itsamatch.png'
import like from '../assets/like.svg'
import deslike from '../assets/dislike.svg'
import matchLogo from '../assets/match.svg'
import github from '../assets/github.svg'


export default function Dashboard({match, history}){
    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)
    const [user, setUser] = useState({})    

    useEffect(() => {
        var loadingEl = document.getElementById('loading')
        var loadEl = document.getElementById('load')  
        var noDevEl = document.getElementById('noDev') 

        async function loadUsers(){

            await setLoading(true)

            const {data} = await api.get('/dashboard',{
                headers: {user: match.params.id}
            })
            const {data : infos} = await api.get('/logge_dev',{
                headers: {user: match.params.id}
            })

            setUsers(data.filter(user => user._id !== match.params.id))
            setUser(infos)
            
            await setLoading(false)
        }
        loadUsers()

        async function setLoading(loading = false){      
        
            if(loading === true){
                loadingEl.style.display = 'block';   
                loadEl.style.display = 'block';  
              } 
              else {
                noDevEl.style.display = 'block';
                loadingEl.style.display = 'none'; 
                loadEl.style.display = 'none'; 
            } 
        }  
    }, [match.params.id])

    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3333', {query : {
            user : match.params.id
        }})

        socket.on('match', dev =>{
            setMatchDev(dev)
        })

    }, [match.params.id])

    async function handleLike(id){   

        await api.post(`/dashboard/${id}/likes`, null, {
            headers : {user: match.params.id}
        })

        setUsers(users.filter(user => user._id !== id))

    }

    async function handleDislike(id){
        await api.post(`/dashboard/${id}/dislikes`, null, {
            headers : {user: match.params.id}
        })
        setUsers(users.filter(user => user._id !== id))
    }
    async function handleClickMatch(e){
        e.preventDefault()     
        history.push(`/dashboard/${match.params.id}/match`)        
    }
    async function handleClickPerfil(e){
        e.preventDefault()     
        history.push(`/dashboard/${match.params.id}/perfil`)        
    }

    return(
        <div className="">
            <header className="header">
                <a href={user.url_github} target="_blank" rel="noopener noreferrer"><img className="github" src={github} alt="github" /></a>
                <button type="button" onClick={handleClickPerfil} className="btAvatar">
                    <img src={user.avatar} alt="avatar"/>
                </button>                    
                <button type="button" onClick={handleClickMatch} className="match">
                    <img src={matchLogo} alt="match"/>
                </button>                        
            </header> 
            <div className="main-conteiner">                
                <img src={logo} alt="logo" />
                <div className="loading-conteiner">
                    <strong id="loading">Carregando...</strong>
                    <img src={load} id="load" alt="load" />
                </div>    
                {users.length > 0 ? (
                        <ul>
                        {users.map(user => (
                        <li key={user._id}>                    
                            <img className="avatar" src={user.avatar} alt="avatar"/>
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)} ><img src={deslike} alt="deslike"></img></button>
                                <button type="button" onClick={() => handleLike(user._id)}><img src={like} alt="like"></img></button>
                            </div>
                        </li>
                        ))}
                    </ul>
                    ) :  (
                        <div className="empty" id="noDev" style={{display:'none'}}>Acabou :(</div>
                    ) }
                    {matchDev && (
                        <div className="match-container">
                            <img src={itsamatch} alt="It's a match" />
                            <img className="img-avatar" src={matchDev.avatar} alt="It's a match" />
                            <strong>{matchDev.name}</strong>
                            <p>{matchDev.bio}</p>
                            <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
                        </div>        
                    )}     
            </div>
        </div>    
    );
}

