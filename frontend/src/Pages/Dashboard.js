import React, {useEffect, useState} from 'react'
import '../css/Dashboard.css'
import api from '../services/api'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import deslike from '../assets/dislike.svg'


export default function Dashboard({match}){
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        async function loadUsers(){
            const {data} = await api.get('/dashboard',{
                headers: {user: match.params.id}
            })
            setUsers(data)
        }
        loadUsers()
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
            <a href="" >
             <img src={logo} alt="logo"></img>

            </a>
            
            {users.length > 0 ? (
                <ul>
                {users.map(user => (
                <li key={user._id}>                    
                    <img src={user.avatar} alt=""></img>
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
            )}

        </div>
    );
}

