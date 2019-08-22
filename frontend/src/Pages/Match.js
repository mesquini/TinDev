import React, {useState, useEffect} from 'react'
import logo from '../assets/logo.svg'
import github from '../assets/github.svg'
import api from '../services/api'

import '../css/Match.css'

export default function Match({match, history}){   
    const [matchs, setMatch] = useState([])

    useEffect(() =>{
        async function loadMatchs(){
            const {data} = await api.get(`/dashboard/${match.params.id}/match`)

            setMatch(data)
        }

        loadMatchs()
    }, [match.params.id])

    
    async function handleMain(){
        await history.push(`/dashboard/${match.params.id}`)
    }


    return(
        <div className="match-conteiner">
            <img onClick={handleMain} className="logo" alt="logo" src={logo} />
            <div className="matchs">
                {matchs.length > 0 ? (
                    <ul>
                        {matchs.map(user => (
                            <li key={user._id}>
                            <img className="avatar" src={user.avatar} alt="avatar" />
                            <footer>
                                <strong>{user.name}<a href={user.url_github} rel="noopener noreferrer" target="_blank"><img className="github" src={github} alt="github" /></a></strong>
                                <p>{user.bio}</p>
                                <p>{user.company} - {user.email} - {user.blog}</p>                            
                            </footer>
                        </li>
                        ))}
                    </ul>
                ):(
                    <strong style={{}}>Você não possui Match :( </strong>
                )}
            </div>
        </div>        
    );    
}

