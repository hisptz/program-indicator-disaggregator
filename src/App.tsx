import React from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'

const MyApp = () => (
    <div className={classes.container}>
        <h1>{i18n.t('Program Indicator Disaggregator')}</h1>
    </div>
)

export default MyApp
