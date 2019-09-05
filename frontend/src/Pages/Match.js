import React, { useState, useEffect } from "react";

import logo from "../assets/logo.svg";
import github from "../assets/github.svg";
import wp from "../assets/whatsapp.svg";
import linkedin from "../assets/linkedin.svg";
import x from "../assets/x-button.svg";
import load from '../assets/load.svg'
import api from "../services/api";

import "../css/Match.css";
import Header from '../Pages/Header'



export default function Match({ match, history }) {
  const [matchs, setMatch] = useState([]);
  const [idMatchs, setIdMatch] = useState([]);

  const url_wpp = "https://api.whatsapp.com/send?phone=55";
  const text_wpp = "&text=Olá%20tudo%20bem?%20Vamos%20fazer%20um%20freela?";

  var devId = localStorage.getItem('@login/devId')
  
  useEffect(() => {
    var loadingEl = document.getElementById('loading')
    var loadEl = document.getElementById('load')   
    var noMatchEl = document.getElementById('noMatch')  

    async function loadMatchs() {

      await setLoading(true)
      const { data } = await api.get(`/match`,{
        headers : {user : devId}
      });
      const {users, id_matchs} = data

      setMatch(users);
      setIdMatch(id_matchs);

      await setLoading(false)
    }
    loadMatchs();

    async function setLoading(loading = false){      
        
      if(loading === true){
          loadingEl.style.display = 'block';   
          loadEl.style.display = 'block';   
          noMatchEl.style.display = 'none';
        } 
        else {
          noMatchEl.style.display = 'block';
          loadingEl.style.display = 'none'; 
          loadEl.style.display = 'none'; 
      }     
  }
  }, [devId]);


  async function handleMain() {
    await history.push(`/dashboard`);
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
      
      <Header history={history} />

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
                        className="tooltip"
                      >
                        <img className="github" src={github} alt="github" />
                        <span className="tooltiptext">GitHub</span>
                      </a>
                      {user.blog ? (
                        <a
                          href={user.blog}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="tooltip"
                        >
                          <img
                            className="linkedin"
                            src={linkedin}
                            alt="linkedin"
                          />
                          <span className="tooltiptext">Linkedin</span>
                        </a>
                      ):
                      (<p                         
                        style={{cursor: 'default'}}                        
                      >
                        <img className="linkedin" style={{display:'none'}} src={wp} alt="wp" />
                      </p>)}
                      {user.celular ? (
                        <a
                          href={url_wpp + user.celular.replace(/[-\\^$*+?.()|[\]{}]/g, "") + text_wpp}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="tooltip"
                        >
                          <img className="whatsapp" src={wp} alt="wp" />
                          <span className="tooltiptext">WhatsApp</span>
                        </a>
                      ):
                      (<p 
                        style={{cursor: 'default'}}
                      >
                        <img className="whatsapp" style={{display:'none'}} src={wp} alt="wp" />
                      </p>)}
                        <button type="button" className="tooltip" onClick={(e) => handleDelete(e,idMatchs[i],user._id)}>
                          <img className="x" src={x} alt="delete"/>
                          <span className="tooltiptext">Deletar Match</span>  
                        </button>                     
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
