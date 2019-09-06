import React, { useState, useEffect } from "react";
import github from "../assets/github.svg";
import api from "../services/api";
import load from '../assets/load.svg'
import matchLogo from '../assets/match.svg'

import "../css/Header.css";

export default function Header({match, history }) {
    const [user, setUser] = useState({});
    var devId = localStorage.getItem('@login/devId')


    useEffect(() => {
        var load2El = document.getElementById('load2')   
        var avatarEl = document.getElementById('avatar') 
    
        async function loadMatchs() {
    
          await setLoading(true)
          
          const { data: infos } = await api.get("/logge_dev", {
            headers: { user: devId }
          });
    
          setUser(infos);
    
          await setLoading(false)
        }
        loadMatchs();
    
        async function setLoading(loading = false){      
            
          if(loading === true){
              load2El.style.display = 'block';  
              avatarEl.style.display = 'none';
            } 
            else {
              avatarEl.style.display = 'block';
              load2El.style.display = 'none'; 
          }     
      }
      }, [devId]);
    
    async function handleClickMatch(e) {
        e.preventDefault();
        history.push(`/match`);
      }
      async function handleClickPerfil(e) {
        e.preventDefault();
        history.push(`/perfil`);
      }

    return (
        <header className="header">
        <a
          href={user.url_github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="github" src={github} alt="github" title="GitHub" />
        </a>
          <img src={load} id="load2" alt="load2" />
        <button type="button" onClick={handleClickPerfil} className="btAvatar">
          <img src={user.avatar} id="avatar" alt="avatar" title="Editar Pefil"/>
        </button>
        <button type="button" onClick={handleClickMatch} className="match">
          <img src={matchLogo} alt="match" title="Seus matchs" />
        </button>
      </header>
    )
}