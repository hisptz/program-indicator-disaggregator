import React from 'react'
import {Route, Routes} from "react-router-dom";
import TemplateProgramIndicatorList from "../TemplateProgramIndicatorList";
import TemplateProgramIndicator from "../TemplateProgramIndicator";


export default function MainRouter(): React.ReactElement {

    return (
        <Routes>
            <Route path='/' element={<TemplateProgramIndicatorList/>}/>
            <Route path='/pi/:id' element={<TemplateProgramIndicator/>}/>
        </Routes>
    )
}
