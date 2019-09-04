import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import login from './Pages/Login'
import dashboard from './Pages/Dashboard'
import match from './Pages/Match'
import editaPerfil from './Pages/EditaPerfil'

export default function Routes(){
    return(
        <BrowserRouter>
            <Route path="/" exact component = {login}/>
            <Route path="/dashboard" exact component = {dashboard}/>
            <Route path="/match" exact component = {match}/>
            <Route path="/perfil" exact component = {editaPerfil}/>
        </BrowserRouter>
    )
}