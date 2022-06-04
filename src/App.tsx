import React from 'react'
import {BrowserRouter} from "react-router-dom";
import classes from './App.module.css'
import MainRouter from "./modules/router";

const App = () => (
    <BrowserRouter>
        <div className={classes.container}>
            <MainRouter/>
        </div>
    </BrowserRouter>
)

export default App
