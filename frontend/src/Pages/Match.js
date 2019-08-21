import React, {useState} from 'react'
import logo from '../assets/logo.svg'
import load from '../assets/load.svg'

import '../css/Match.css'

export default function Match(){    

    return(
        <div className="perfil-container">
            <img src={logo} />
            <strong>Pagina em progresso... <img src={load} /> </strong>
        </div>        
    );    
}

