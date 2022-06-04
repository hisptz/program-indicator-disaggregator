import React from 'react'
import {useParams} from "react-router-dom";


export default function TemplateProgramIndicator(): React.ReactElement {
    const {id} = useParams<{ id: string }>();

    return (
        <h1>Template indicator: {id}</h1>
    )
}
