import React, {useState, useEffect} from 'react'
import InputMask from 'react-input-mask'

import logo from '../assets/logo.svg'

import api from '../services/api'
import Header from '../Pages/Header'

import '../css/EditaPerfil.css'

export default function EditaPerfil({match, history}){
    var devId = localStorage.getItem('@login/devId')
    const [user, setUser] = useState({})
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [company, setCompany] = useState('')
    const [blog, setBlog] = useState('')
    const [email,  setEmail] = useState('')
    const [celular,  setCelular] = useState('')
    
    useEffect(() => {
        
        async function loadUser(){

            const {data} = await api.get('/logge_dev',{
                headers: {user: devId}
            })
            setUser(data)            
        }
        loadUser()


    }, [devId])
    
    function trataCampoNull(obj){
        if(!obj.name)
            obj.name = user.name
        if(!obj.bio)
            obj.bio = user.bio
        if(!obj.company)
            obj.company = user.company
        if(!obj.blog)
            obj.blog = user.blog
        if(!obj.email)
            obj.email = user.email  
        if(!obj.celular)
            obj.celular = user.celular  
    }
    
    async function handleSubmit(e){
        e.preventDefault() 
        const update = {name, bio, company, blog, email, celular}
       
        await trataCampoNull(update)
        
        await api.put(`/perfil`, update, {
            headers: {user: devId}
        })
        
        handleHome()
    }
    
    function handleHome(){
        history.push(`/dashboard`)
    }
    
    return(
        <div>

            <Header history={history} />

        <div className="main-container">
            <div className="edita-perfil" >
                <img className="logo" src={logo} alt="logo" onClick={handleHome} />  
                <form onSubmit={handleSubmit}>
                    <p> Nome: <input type="text" value={name} placeholder={user.name} onChange={e => setName(e.target.value) }/></p>
                    <p> Biografia: <textarea type="text" value={bio} placeholder={user.bio}  onChange={e => setBio(e.target.value) }/></p>
                    <p> Empresa: <input type="text" value={company} placeholder={user.company} onChange={e => setCompany(e.target.value) }/></p>
                    <p> Linkedin: <input type="text" value={blog} placeholder={user.blog}  onChange={e => setBlog(e.target.value) }/> </p>  
                    <p> Email: <input type="text" value={email} placeholder={user.email} onChange={e => setEmail(e.target.value) }/></p>
                    
                    {user.celular ?
                    (<p> WhatsApp: <InputMask type="text" mask="(99)99999-9999" value={celular} placeholder={user.celular} onChange={e => setCelular(e.target.value) } maskChar={null} /></p>
                    ):(
                    <p> WhatsApp: <InputMask type="text" mask="(99)99999-9999" value={celular} placeholder='DDDNNNNNNNNN' onChange={e => setCelular(e.target.value) } maskChar={null}/></p>
                        )}
                    
                    <button type="submit">Salvar</button>     
                </form>         
            </div>
        </div>   
        
        </div>     
    );    
}

