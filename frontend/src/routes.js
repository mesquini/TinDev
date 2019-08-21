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
            <Route path="/dashboard/:id" exact component = {dashboard}/>
            <Route path="/dashboard/:id/match" exact component = {match}/>
            <Route path="/dashboard/:id/perfil" exact component = {editaPerfil}/>
        </BrowserRouter>
    )
}