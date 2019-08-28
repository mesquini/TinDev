import React, {useState, useEffect} from 'react'
import logo from '../assets/logo.svg'
import github from '../assets/github.svg'
import matchLogo from '../assets/match.svg'

import api from '../services/api'

import '../css/EditaPerfil.css'
import '../css/Header.css'

export default function EditaPerfil({match, history}){
    const [user, setUser] = useState([])
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [company, setCompany] = useState('')
    const [blog, setBlog] = useState('')
    const [email,  setEmail] = useState('')
    const [celular,  setCelular] = useState('')
    
    useEffect(() => {
        async function loadUser(){
            const {data} = await api.get('/dashboard',{
                headers: {user: match.params.id}
            })
            setUser(data.filter(user => user._id === match.params.id))
        }
        loadUser()
    }, [match.params.id])

    function trataCampoNull(obj){
        if(obj.name === '')
            obj.name = user.map(user => user.name).toString()
        if(obj.bio === "")
            obj.bio = user.map(user => user.bio).toString()
        if(obj.company === "")
            obj.company = user.map(user => user.company).toString()
        if(obj.blog === "")
            obj.blog = user.map(user => user.blog).toString()
        if(obj.email === "")
            obj.email = user.map(user => user.email).toString()   
        if(obj.celular === "")
            obj.celular = user.map(user => user.celular).toString()  
    }

    async function handleSubmit(e){
        e.preventDefault() 
        const update = {name, bio, company, blog, email, celular}

        await trataCampoNull(update)

        await api.put(`/dashboard/${match.params.id}/perfil`, update)

        history.push(`/dashboard/${match.params.id}`)
    }

    function handleHome(){
        history.push(`/dashboard/${match.params.id}`)
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
    <div>
        <header className="header">
                <a href={user.map(user => user.url_github)} target="_blank" rel="noopener noreferrer"><img className="github" src={github} alt="github" /></a>
                <button type="button" onClick={handleClickPerfil} className="btAvatar">
                    <img src={user.map(user => user.avatar)} alt="avatar"/>
                </button>                    
                <button type="button" onClick={handleClickMatch} className="match">
                    <img src={matchLogo} alt="match"/>
                </button>                        
            </header> 
        <div className="main-container">
            <div className="edita-perfil">
                <img className="logo" src={logo} alt="logo" onClick={handleHome} />
                <img className="avatar" src={user.map(user => user.avatar)} alt="avatar" />
                <form onSubmit={handleSubmit}>
                    <p> Nome: <input type="text" value={name} placeholder={user.map(user => user.name)} onChange={e => setName(e.target.value) }/></p>
                    <p> Biografia: <textarea type="text" value={bio} placeholder={user.map(user => user.bio)}  onChange={e => setBio(e.target.value) }/></p>
                    <p> Empresa: <input type="text" value={company} placeholder={user.map(user => user.company)} onChange={e => setCompany(e.target.value) }/></p>
                    <p> Linkedin: <input type="text" value={blog} placeholder={user.map(user => user.blog)}  onChange={e => setBlog(e.target.value) }/> </p>  
                    <p> Email: <input type="text" value={email} placeholder={user.map(user => user.email)} onChange={e => setEmail(e.target.value) }/></p>
                    {user.map(user => user.celular !== '' ?
                    (<p> WhatsApp: <input type="text" key={user._id} value={celular} placeholder={user.celular} maxLength={12}  onChange={e => setCelular(e.target.value) }/></p>
                    ):(
                    <p> WhatsApp: <input type="text" value={celular} placeholder='DDDNNNNNNNNN' maxLength={12}  onChange={e => setCelular(e.target.value) }/></p>
                    ))}
                    
                    <button type="submit">Salvar</button>     
                </form>         
            </div>
        </div>   
        </div>     
    );    
}

