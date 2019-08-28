import React, { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import github from "../assets/github.svg";
import matchLogo from "../assets/match.svg";
import wp from "../assets/whatsapp.svg";
import linkedin from "../assets/linkedin.svg";
import x from "../assets/x-button.svg";
import api from "../services/api";

import "../css/Match.css";
import "../css/Header.css";

export default function Match({ match, history }) {
  const [matchs, setMatch] = useState([]);
  const [user, setUser] = useState([]);
  const url_wpp = "https://api.whatsapp.com/send?phone=55";
  const text_wpp = "&text=Olá%20tudo%20bem?%20Vamos%20fazer%20um%20freela?";

  useEffect(() => {
    async function loadMatchs() {
      const { data } = await api.get(`/dashboard/${match.params.id}/match`);
      const { data: infos } = await api.get("/dashboard", {
        headers: { user: match.params.id }
      });

      setMatch(data);
      setUser(infos.filter(user => user._id === match.params.id));
    }

    loadMatchs();
  }, [match.params.id]);

  async function handleMain() {
    await history.push(`/dashboard/${match.params.id}`);
  }
  async function handleClickMatch(e) {
    e.preventDefault();
    history.push(`/dashboard/${match.params.id}/match`);
  }
  async function handleClickPerfil(e) {
    e.preventDefault();
    history.push(`/dashboard/${match.params.id}/perfil`);
  }
  async function handleDelete(e) {
    e.preventDefault();
    if(window.confirm('Deseja deletar esse Match?')){

    }
  }

  return (
    <div>
      <header className="header">
        <a
          href={user.map(user => user.url_github)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="github" src={github} alt="github" />
        </a>
        <button type="button" onClick={handleClickPerfil} className="btAvatar">
          <img src={user.map(user => user.avatar)} alt="avatar" />
        </button>
        <button type="button" onClick={handleClickMatch} className="match">
          <img src={matchLogo} alt="match" />
        </button>
      </header>
      <div className="match-conteiner">
        <img onClick={handleMain} className="logo" alt="logo" src={logo} />
        <div id="dialog-confirm" title="Executar função?"></div> 
        <div className="matchs">
          {matchs.length > 0 ? (
            <ul>
              {matchs.map(user => (
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
                      {user.blog !== "Blog não informado"&& (
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
                      )}
                      {user.celular !== '' && (
                        <a
                          href={url_wpp + user.celular + text_wpp}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img className="whatsapp" src={wp} alt="wp" />
                        </a>
                      )}
                      <button type="button" onClick={handleDelete}><img className="x" src={x} alt="delete"/></button>
                     
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
            <strong style={{}}>Você não possui Match :( </strong>
          )}
        </div>
      </div>
    </div>
  );
}
