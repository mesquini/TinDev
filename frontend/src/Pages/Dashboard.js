import React, {useEffect, useState} from 'react'
import io from 'socket.io-client'
import '../css/Dashboard.css'
import api from '../services/api'

import logo from '../assets/logo.svg'
import itsamatch from '../assets/itsamatch.png'
import like from '../assets/like.svg'
import deslike from '../assets/dislike.svg'


export default function Dashboard({match}){
    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)
    
    useEffect(() => {
        async function loadUsers(){
            const {data} = await api.get('/dashboard',{
                headers: {user: match.params.id}
            })
            setUsers(data)
        }
        loadUsers()
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

    return(
        <div className="main-conteiner">
             <img src={logo} alt="logo" />
            {users.length > 0 ? (
                    <ul>
                    {users.map(user => (
                    <li key={user._id}>                    
                        <img src={user.avatar} alt="avatar"/>
                        <footer>
                            <strong>
                                {user.name}
                            </strong>
                            <p>{user.bio}</p>
                        </footer>
                        <div className="buttons">
                            <button type="button" onClick={ () => handleDislike(user._id)} ><img src={deslike} alt="deslike"></img></button>
                            <button type="button" onClick={() => handleLike(user._id)}><img src={like} alt="like"></img></button>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                    <div className="empty">Acabou :(</div>
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
    );
}

