import { Button } from 'primereact/button';
import React from 'react';
import OSForm from '../OSForm';
import logo from "../assets/velo27logo192.jpg"
import { FB } from '../firebaseConfig';
import { withRouter } from 'react-router-dom';

export const OSPresentation = withRouter((props) => {
    return <>
        <div className={`p-d-flex p-jc-between p-ai-${props.viewOnly ? 'start' : 'center'} p-mt-4 p-mb-sm-2`}>
            {!!props.viewOnly && <Button onClick={() => props.history.push('/')} icon='pi pi-home' tooltip='Ir para pagina principal' className='p-button-outlined' />}
            <img src={logo} width='65px' alt="Velo27 logo" />
            <Button onClick={() => FB.auth().signOut().catch(() => props.history.push('/'))} icon='pi pi-sign-out' tooltip='Deslogar' className='p-button-outlined' />
        </div>
        <OSForm {...props} />
    </>
})