import React, { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import github from "../assets/github.svg";
import matchLogo from "../assets/match.svg";
import wp from "../assets/whatsapp.svg";
import linkedin from "../assets/linkedin.svg";
import x from "../assets/x-button.svg";
import api from "../services/api";
import load from '../assets/load.svg'


import "../css/Match.css";
import "../css/Header.css";

export default function Match({ match, history }) {
  const [matchs, setMatch] = useState([]);
  const [idMatchs, setIdMatch] = useState([]);
  const [user, setUser] = useState({});
  const url_wpp = "https://api.whatsapp.com/send?phone=55";
  const text_wpp = "&text=Olá%20tudo%20bem?%20Vamos%20fazer%20um%20freela?";
  var devId = localStorage.getItem('@login/devId')
  
  useEffect(() => {
    var loadingEl = document.getElementById('loading')
    var loadEl = document.getElementById('load')  
    var load2El = document.getElementById('load2')  
    var noMatchEl = document.getElementById('noMatch')  
    var avatarEl = document.getElementById('avatar') 

    async function loadMatchs() {

      await setLoading(true)
      const { data } = await api.get(`/match`,{
        headers : {user : devId}
      });
      const {users, id_matchs} = data

      const { data: infos } = await api.get("/logge_dev", {
        headers: { user: devId }
      });

      setMatch(users);
      setIdMatch(id_matchs);
      setUser(infos);

      await setLoading(false)
    }
    loadMatchs();

    async function setLoading(loading = false){      
        
      if(loading === true){
          loadingEl.style.display = 'block';   
          loadEl.style.display = 'block'; 
          load2El.style.display = 'block';  
          noMatchEl.style.display = 'none';
          avatarEl.style.display = 'none';
        } 
        else {
          avatarEl.style.display = 'block';
          noMatchEl.style.display = 'block';
          loadingEl.style.display = 'none'; 
          loadEl.style.display = 'none'; 
          load2El.style.display = 'none'; 
      }     
  }
  }, [devId]);


  async function handleMain() {
    await history.push(`/dashboard`);
  }
  async function handleClickMatch(e) {
    e.preventDefault();
    history.push(`/match`);
  }
  async function handleClickPerfil(e) {
    e.preventDefault();
    history.push(`/perfil`);
  }
  async function handleDelete(e, matchId, id) {
    e.preventDefault()

    if(window.confirm('Deseja deletar esse Match?')){
        await api.delete(`/dashboard/${devId}/match`,{
          headers: { matchId, targerid: id }
        });
        
        setMatch(matchs.filter(user => user._id !== id))
    }
  }

  return (
    <div>
      <header className="header">
        <a
          href={user.url_github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="github" src={github} alt="github" />
        </a>
          <img src={load} id="load2" alt="load2" />
        <button type="button" onClick={handleClickPerfil} className="btAvatar">
          <img src={user.avatar} id="avatar" alt="avatar"/>
        </button>
        <button type="button" onClick={handleClickMatch} className="match">
          <img src={matchLogo} alt="match" />
        </button>
      </header>
      <div className="match-conteiner">
        <img onClick={handleMain} className="logo" alt="logo" src={logo} />
        <div className="loading-conteiner">
          <strong id="loading">Carregando...</strong>
          <img src={load} id="load" alt="load" />
        </div>      
        <div className="matchs">
          {matchs.length > 0 ? (
            <ul>
              {matchs.map((user, i, users) => (
                <li key={user._id}>
                  <img className="avatar" src={user.avatar} alt="avatar" />
                  <footer>
                    <strong>
                      {user.name}
                      <a
                        href={user.url_github}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <img className="github" src={github} alt="github" />
                      </a>
                      {user.blog !== null ? (
                        <a
                          href={user.blog}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img
                            className="linkedin"
                            src={linkedin}
                            alt="linkedin"
                          />
                        </a>
                      ):
                      (<a                         
                        style={{cursor: 'default'}}                        
                      >
                        <img className="linkedin" style={{display:'none'}} src={wp} alt="wp" />
                      </a>)}
                      {user.celular !== null ? (
                        <a
                          href={url_wpp + user.celular + text_wpp}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img className="whatsapp" src={wp} alt="wp" />
                        </a>
                      ):
                      (<a 
                        style={{cursor: 'default'}}
                      >
                        <img className="whatsapp" style={{display:'none'}} src={wp} alt="wp" />
                      </a>)}
                        <button type="button" onClick={(e) => handleDelete(e,idMatchs[i],user._id)}><img className="x" src={x} alt="delete"/></button>                     
                      </strong>
                    <p>{user.bio}</p>
                      <p>
                        {user.company} - {user.email}
                      </p>
                  </footer>
                </li>
              ))}
            </ul>
          ) : (
            <strong className="empty" id="noMatch">Você não possui Match :( </strong>
          )}
        </div>
      </div>
    </div>
  );
}
