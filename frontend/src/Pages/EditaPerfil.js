import React, {useState, useEffect} from 'react'
import logo from '../assets/logo.svg'
import load from '../assets/load.svg'

import api from '../services/api'
import '../css/EditaPerfil.css'

export default function EditaPerfil({match, history}){
    const [user, setUser] = useState([])

    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [company, setCompany] = useState('')
    const [blog, setBlog] = useState('')
    const [email,  setEmail] = useState('')
    
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
    }

    async function handleSubmit(e){
        e.preventDefault() 
        const update = {name, bio, company, blog, email}

        await trataCampoNull(update)
        console.log(update)

        await api.put(`/dashboard/${match.params.id}/perfil`, update)

        history.push(`/dashboard/${match.params.id}`)
    }

    function handleHome(){
        history.push(`/dashboard/${match.params.id}`)
    }

    return(
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
                    <button type="submit">Salvar</button>     
                </form>         
            </div>
        </div>        
    );    
}

