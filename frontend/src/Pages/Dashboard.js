import React, {useEffect, useState} from 'react'
import io from 'socket.io-client'
import '../css/Dashboard.css'
import '../css/Header.css'
import api from '../services/api'

import logo from '../assets/logo.svg'
import load from '../assets/load.svg'
import itsamatch from '../assets/itsamatch.png'
import like from '../assets/like.svg'
import star from '../assets/star.svg'
import deslike from '../assets/dislike.svg'
import matchLogo from '../assets/match.svg'
import github from '../assets/github.svg'


export default function Dashboard({match, history}){
    const [users, setUsers] = useState([])
    const [superLike, setSuper_Likes] = useState([])
    const [matchDev, setMatchDev] = useState(null)
    const [infosDev, setUser] = useState({})    
    var devId = localStorage.getItem('@login/devId')

    useEffect(() => {
        var loadingEl = document.getElementById('loading')
        var loadEl = document.getElementById('load')  
        var load2El = document.getElementById('load2')  
        var noDevEl = document.getElementById('noDev') 
        var avatarEl = document.getElementById('avatar') 
        
        async function loadUsers(){

            await setLoading(true)

            const {data} = await api.get('/dashboard',{
                headers: {user: devId}
            })
            const {data : infos} = await api.get('/logge_dev',{
                headers: {user: devId}
            })

            await setUsers(data.filter(user => user._id !== devId))
            await setSuperLikes(data.filter(user => user._id !== devId))
            await setUser(infos)
            
            await setLoading(false)
        }
        loadUsers()

        async function setSuperLikes(u){
            var sLike = []
            var cont = u.length - 1
            u.map(user => 
                {
                    if(user.superlikes.length > 0){
                        for (var i=user.superlikes.length-1; i>=0; i--) {
                            if (user.superlikes[i] === devId) {
                                sLike[cont] = user._id      
                                cont--      
                            } 
                        }   
                    }
            }) 
            setSuper_Likes(sLike)          
        }

        async function setLoading(loading = false){      
        
            if(loading === true){
                loadingEl.style.display = 'block';   
                loadEl.style.display = 'block';  
                load2El.style.display = 'block';  
                noDevEl.style.display = 'none';
                avatarEl.style.display = 'none';
                
            } 
            else {
                avatarEl.style.display = 'block';
                noDevEl.style.display = 'block';
                loadingEl.style.display = 'none'; 
                load2El.style.display = 'none'; 
                loadEl.style.display = 'none'; 
            } 
        }  
    }, [devId])

    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3333', {query : {
            user : devId
        }})

        socket.on('match', dev =>{
            setMatchDev(dev)
        })
        socket.on('superlike', dev =>{
            setUser(dev)
        })

    }, [devId])

    async function handleLike(id){   

        await api.post(`/dashboard/${id}/likes`, null, {
            headers : {user: devId}
        })

        setUsers(users.filter(user => user._id !== id))
    }
    async function handleSuperLike(id){   

        await api.post(`/dashboard/${id}/superlikes`, null, {
            headers : {user: devId}
        })

        await setUsers(users.filter(user => user._id !== id))
    }
    async function handleDislike(id){
        await api.post(`/dashboard/${id}/dislikes`, null, {
            headers : {user: devId}
        })
        setUsers(users.filter(user => user._id !== id))
    }
    async function handleClickMatch(e){
        e.preventDefault()     
        history.push(`/match`)        
    }
    async function handleClickPerfil(e){
        e.preventDefault()     
        history.push(`/perfil`)        
    }   

    return(
        <div className="">
            <header className="header">
                <a href={infosDev.url_github} target="_blank" rel="noopener noreferrer"><img className="github" src={github} alt="github" /></a>
                    <img src={load} id="load2" alt="load" />
                <button type="button" onClick={handleClickPerfil} className="btAvatar">
                    <img src={infosDev.avatar} id="avatar" alt="avatar"/>
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
                            {superLike.length > 0 && (
                                superLike.map(s => (
                                    s === user._id &&(
                                        <img className="star" placeholder="teste" key={s} title="Super Like" src={star} alt="star"/>
                                    )
                                ))
                            )}
                            <footer>
                                <strong>
                                    <a href={user.url_github} target="_blank" rel="noopener noreferrer" className="tooltip">
                                        <span className="tooltiptext">GitHub</span>
                                        <img className="github" src={github} alt="github"/>
                                    </a> 
                                {user.name} 
                                </strong>
                                
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)} ><img src={deslike} alt="deslike"></img></button>
                                {infosDev.super_like === true ? (
                                    <button type="button" onClick={() => handleSuperLike(user._id)}><img src={star} alt="star"></img></button>

                                ) : (
                                    <button type="button" style={{cursor: 'default', backgroundColor : 'rgba(0,0,0,0.3)'}}><img src={star} alt="star"></img></button>
                                )}
                                <button type="button" onClick={() => handleLike(user._id)}><img src={like} alt="like"></img></button>
                            </div>
                        </li>
                        ))}
                    </ul>
                    ) :  (
                        <div className="empty" id="noDev">Acabou :(</div>
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

