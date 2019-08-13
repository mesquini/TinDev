import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import login from './Pages/Login'
import dashboard from './Pages/Dashboard'

export default function Routes(){
    return(
        <BrowserRouter>
            <Route path="/" exact component = {login}/>
            <Route path="/dashboard/:id" component = {dashboard}/>
        </BrowserRouter>
    )
}