import React from 'react'
import {HashRouter} from "react-router-dom";
import {DataStoreProvider} from "@dhis2/app-service-datastore"
import classes from './App.module.css'
import MainRouter from "./modules/router";
import "./layout.css";
import "./main.css"

const App = (): React.ReactElement => (
    <DataStoreProvider namespace={"hisptz-pid"}>
        <HashRouter>
            <div className={classes['main-container']}>
                <MainRouter/>
            </div>
        </HashRouter>
    </DataStoreProvider>
)

export default App;
