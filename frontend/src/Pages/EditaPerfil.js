import React, {useState, useEffect} from 'react'
import logo from '../assets/logo.svg'
import github from '../assets/github.svg'
import matchLogo from '../assets/match.svg'
import load from '../assets/load.svg'

import api from '../services/api'

import '../css/EditaPerfil.css'
import '../css/Header.css'

export default function EditaPerfil({match, history}){
    const [user, setUser] = useState({})
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [company, setCompany] = useState('')
    const [blog, setBlog] = useState('')
    const [email,  setEmail] = useState('')
    const [celular,  setCelular] = useState('')
    
    useEffect(() => {
        var loadEl = document.getElementById('load')  
        var avatarEl = document.getElementById('avatar') 

        async function loadUser(){

            await setLoading(true)

            const {data} = await api.get('/logge_dev',{
                headers: {user: match.params.id}
            })
            setUser(data)        
            await setLoading(false)    
        }
        loadUser()

        async function setLoading(loading = false){      
        
            if(loading === true){ 
                loadEl.style.display = 'block';  
                avatarEl.style.display = 'none';                
            } 
            else {
                avatarEl.style.display = 'block';
                loadEl.style.display = 'none'; 
            } 
        }

    }, [match.params.id])
    
    function trataCampoNull(obj){
        if(obj.name === '')
            obj.name = user.name.toString()
        if(obj.bio === "")
            obj.bio = user.bio.toString()
        if(obj.company === null)
            obj.company = user.company.toString()
        if(obj.blog === null)
            obj.blog = user.blog.toString()
        if(obj.email === null)
            obj.email = user.email.toString()   
        if(obj.celular === null)
            obj.celular = user.celular.toString()  
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
                <a href={user.url_github} target="_blank" rel="noopener noreferrer"><img className="github" src={github} alt="github" /></a>
                    <img src={load} id="load" alt="load" />
                <button type="button" onClick={handleClickPerfil} className="btAvatar">
                    <img src={user.avatar} id="avatar" alt="avatar"/>
                </button>                    
                <button type="button" onClick={handleClickMatch} className="match">
                    <img src={matchLogo} alt="match"/>
                </button>                        
            </header> 
        <div className="main-container">
            <div className="edita-perfil" >
                <img className="logo" src={logo} alt="logo" onClick={handleHome} />  
                <form onSubmit={handleSubmit}>
                    <p> Nome: <input type="text" value={name} placeholder={user.name} onChange={e => setName(e.target.value) }/></p>
                    <p> Biografia: <textarea type="text" value={bio} placeholder={user.bio}  onChange={e => setBio(e.target.value) }/></p>
                    <p> Empresa: <input type="text" value={company} placeholder={user.company} onChange={e => setCompany(e.target.value) }/></p>
                    <p> Linkedin: <input type="text" value={blog} placeholder={user.blog}  onChange={e => setBlog(e.target.value) }/> </p>  
                    <p> Email: <input type="text" value={email} placeholder={user.email} onChange={e => setEmail(e.target.value) }/></p>
                    {user.celular !== null ?
                    (<p> WhatsApp: <input type="text" value={celular} placeholder={user.celular} maxLength={12}  onChange={e => setCelular(e.target.value) }/></p>
                    ):(
                    <p> WhatsApp: <input type="text" value={celular} placeholder='DDDNNNNNNNNN' maxLength={12}  onChange={e => setCelular(e.target.value) }/></p>
                        )}
                    
                    <button type="submit">Salvar</button>     
                </form>         
            </div>
        </div>   
        
        </div>     
    );    
}

