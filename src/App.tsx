import React from 'react'
import {BrowserRouter} from "react-router-dom";
import classes from './App.module.css'
import MainRouter from "./modules/router";
import "./layout.css";

const App = (): React.ReactElement => (
    <BrowserRouter>
        <div className={classes['main-container']}>
            <MainRouter/>
        </div>
    </BrowserRouter>
)

export default App
